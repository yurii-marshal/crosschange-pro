/**
 *
 * Before start working make sure that you have the base file with the proper name uploaded to the oneSky
1. install this package
  https://github.com/brainly/nodejs-onesky-utils
  npm install --save-dev @brainly/onesky-utils
2. add run commands to CI/CD, OR use this command for local debug and development
    NODE_ENV=local NODE_DEBUG=translations-updater OS_PROJECT_ID=173411 OS_SECRET_KEY=Vg0Irhqgwg5HbhNqmOXaVPbsl60iDrXo OS_PUBLIC_KEY=xNWPUdWhjROlYrBb5pbR5d9haZpDhcRF  OS_BASE_FILE=en.json ONE_SKY_BASE_FILE_NAME=base.json BASE_LANG=en node translationsUpdater
3. Add
 "typeRoots": [
  "node_modules/@types"
 ]
 to tsconfig.json

****************************************************
 env vars set:
 OS_PROJECT_ID=123
 OS_SECRET_KEY=TEST
 OS_PUBLIC_KEY=TEST
 OS_BASE_FILE=en.json
 ONE_SKY_BASE_FILE_NAME=platform-en.json
 BASE_LANG=en

*/

const onesky = require('@brainly/onesky-utils');
const fsPromises = require('fs').promises;
const path = require('path');
const util = require('util');
const debuglog = util.debuglog('translations-updater');

class TranslationsUpdater {
  /**
   *
   * @param {string} projectID
   * @param {string} secretKey
   * @param {string} publicKey
   * @param {string} baseFile
   * @param {string} oneSkyBaseFileName
   * @param {string} baseLang
   * @param {Array<string>} baseDir
   * @param {string} indentation
   */
  constructor(projectID, secretKey, publicKey, baseFile, oneSkyBaseFileName, baseLang, baseDir, indentation) {
    this.projectID = projectID;
    this.secretKey = secretKey;
    this.publicKey = publicKey;
    this.baseFile = baseFile;
    this.oneSkyBaseFileName = oneSkyBaseFileName;
    this.baseLang = baseLang;
    this.baseDir = baseDir;
    this.baseFilePath = path.join(...baseDir, baseFile);
    this.indentation = indentation;
    this.baseOptions = {
      secret: secretKey,
      apiKey: publicKey,
      projectId: projectID
    };
    this.loadEnglishBaseOptions = {
      language: baseLang,
      fileName: oneSkyBaseFileName
    };
  }

  /**
   *
   * @param {Array<object>} resp
   * @return {Array<string>}
   */
  getLanguagesFromResp(resp) {
    /*
    PLEASE, TAKE IN CONSIDERATION THE CODE AND LOCALE PARAMETERS

    resp for english:
      "code":"en",
      "english_name":"English",
      "local_name":"English",
      "locale":"en",
      "region":"",
      "is_base_language":true

    resp for chinese:
      "code":"zh-CN",
      "english_name":"Chinese Simplified",
      "local_name":"\u7b80\u4f53\u4e2d\u6587",
      "locale":"zh",
      "region":"CN",
      "is_base_language":false,

    * */

    return resp['data'].map(v => {
      return v.code;
    });
  }

  /**
   *
   * @param {string} text
   * @return {boolean}
   */
  validateJson(text) {
    return !text.match(/""/, 'g');
  }

  /**
   *
   * @param {object} mergedContent
   * @param {object} localBaseContent
   * @param {string} filePath
   * @param {string} lang
   * @return {Promise<void>}
   */
  async mergeWithDefaultAndSave(mergedContent, localBaseContent, filePath, lang) {
    try {
      mergedContent = this.mergeIfEmpty(JSON.parse(JSON.stringify(mergedContent)), localBaseContent, []);
    } catch (e) {
      console.error('mergeWithDefaultAndSave error', e);
      throw e;
    }

    let newContent = JSON.stringify(mergedContent, null, this.indentation);
    if (newContent) {
      await fsPromises.writeFile(filePath, newContent, 'utf8');
      debuglog(`the translation file for ${lang} lang has been saved to ${filePath}`);
    }
  }

  /**
   * load all translations from oneSky and save to local files
   * @param {object} options
   * @return {Promise<void>}
   */
  async loadFiles(options) {
    const localBaseContent = await this.getLocalBase();
    for (let i = 0; i < options.length; i++) {
      let lang = options[i]['language'];
      // TODO: REFACTOR - rename language file or make additional parameter map
      if (lang === 'zh-CN') {
        lang = 'chi';
      }
      let downloadedContent;

      try {
        downloadedContent = await onesky.getFile(options[i]);
      }
      catch (e) {
        debuglog(`Error load file for lang: ${lang}. ` + e);
        console.error(`Error load file for lang: ${lang}. ` + e)
        throw e;
      }

      try {
        downloadedContent = JSON.parse(downloadedContent);
      } catch (e) {
        debuglog(`failed to parse downloaded content for ${lang}. Please check if any of them exist or that's an error`);
        downloadedContent = { ...localBaseContent };
      }

      let fp = `${path.join(...this.baseDir)}${path.sep}${lang}.json`;
      let fileContent;
      try {
        fileContent = await fsPromises.readFile(fp, 'utf8');
      } catch (e) {
        fileContent = '{}';
      }

      let localTranslation;
      try {
        localTranslation = JSON.parse(fileContent);
      } catch (e) {
        debuglog(`failed to parse local file content for ${lang}`);
        console.error(`failed to parse local file content for ${lang}. continuing execution.`)
        continue;
      }
      let mergedContent = {...localTranslation, ...downloadedContent};

      await this.mergeWithDefaultAndSave(mergedContent, localBaseContent, fp, lang);
    }
    debuglog(`Update files for languages which are absent in oneSky...`);
    await this.checkLocalForEmpty(options, localBaseContent);
    debuglog(`Missing files updated.`);

  }

  /**
   *
   * @param {Array<object>} options
   * @param {object} localBaseContent
   * @return {Promise<void>}
   */
  async checkLocalForEmpty(options, localBaseContent) {
    /*
    * Additional check. If some languages are missing in oneSky but
    * present locally: fill empty values from base file
    * */
    const langs = new Set(options.map(v => v.language));
    let localLangs = await fsPromises.readdir(path.join(...this.baseDir));
    localLangs = localLangs.map(v => v.replace('.json', ''))
    for (const localLang of localLangs) {
      if(langs.has(localLang)) {
        continue;
      }
      let fp = `${path.join(...this.baseDir)}${path.sep}${localLang}.json`;
      const fileContent = await fsPromises.readFile(fp, 'utf8');
      let localTranslation;
      try {
        localTranslation = JSON.parse(fileContent);
      } catch (e) {
        debuglog(`failed to parse local file content for ${localLang}`);
        console.error(`failed to parse local file content for ${localLang}. continuing execution`);
        continue;
      }
      await this.mergeWithDefaultAndSave(localTranslation, localBaseContent, fp, localLang);
    }
  }

  /**
   *
   * @param {object} obj
   * @param {Array<string>} path
   * @return {string|any}
   */
  getValRecursive(obj, path) {
    if (!path.length || typeof obj !== 'object') {
      return '';
    }
    let shifted = path.shift();
    let res = JSON.parse(JSON.stringify(obj));
    while (shifted) {
      res = res[shifted];
      if (!res) {
        return '';
      }
      shifted = path.shift();
    }
    return res;
  }

  /**
   *
   * @param {object} dest
   * @param {object} def
   * @param {Array<string>}fullKey
   */
  mergeIfEmpty(dest, def, fullKey) {
    fullKey = fullKey || [];
    for(const key in dest) {
      if (!dest.hasOwnProperty(key)) {
        continue;
      }
      if (typeof dest[key] === 'object') {
        this.mergeIfEmpty(dest[key], def, [...fullKey, key])
      } else {
        if (!dest[key]) {
          dest[key] = this.getValRecursive(def, [...fullKey, key]);
        }
      }
    }
    return dest;
  }

  /**
   *
   * @param {object} local
   * @param {object} downloaded
   */
  merge(local, downloaded) {
    for (let p in local) {
      if (!downloaded[p] || typeof local[p] !== typeof downloaded[p]) {
        continue;
      }
      if (typeof local[p] === 'object') {
        local[p] = this.merge(local[p], downloaded[p]);
      } else {
        local[p] = downloaded[p];
      }
    }
    return local;
  }

  /**
   *
   * @param {string} secret
   * @param {string} publicKey
   * @param {string} projectId
   * @param {string} baseFile
   * @param {Array<string>} allowedLangs
   * @return {[]}
   */
  prepareReqvData(secret, publicKey, projectId, baseFile, allowedLangs) {
    return allowedLangs.map(lang => {
      return {
        language: lang,
        fileName: baseFile,
        secret: secret,
        apiKey: publicKey,
        projectId: projectId,
      }
    })
  }

  /**
   * loads base file data from oneSky. returns parsed file content
   * @return {Promise<object>}
   */
  async getBaseFile() {
    let content
    try {
      const options = { ...this.baseOptions, ...this.loadEnglishBaseOptions };
      content = await onesky.getFile(options);
    } catch (e) {
      debuglog('syncTranslations onesky.getFile error: ', e);
      console.error('syncTranslations onesky.getFile error: ', e);
      throw e;
    }

    debuglog('Base translation loaded');
    return JSON.parse(content);
  }

  /**
   * post base file content to oneSky
   * @param {string} newContent
   * @return {Promise<void>}
   */
  async postBaseFile(newContent) {
    let postFileOptions = {
      language: this.baseLang,
      fileName: this.oneSkyBaseFileName,
      format: 'HIERARCHICAL_JSON',
      content: newContent,
      keepStrings: false,
      allowSameAsOriginal: true
    };

    const postOptions = {...this.baseOptions, ...postFileOptions};
    const toLogPostOptions = JSON.parse(JSON.stringify(postOptions));
    toLogPostOptions.content = '';

    try {
      await onesky.postFile(postOptions);
    } catch (e) {
      debuglog('syncTranslations onesky.postFile error: ', e);
      console.error('syncTranslations onesky.postFile error: ', e);
      throw e;
    }
  }

  /**
   *
   * @return {Promise<void>}
   */
  async syncAll() {
    debuglog('Syncing translations...');
    const languages = await onesky.getLanguages(this.baseOptions);

    let allowedLangs = this.getLanguagesFromResp(JSON.parse(languages));
    let opts = this.prepareReqvData(this.secretKey, this.publicKey, this.projectID, this.oneSkyBaseFileName, allowedLangs);
    await this.loadFiles(opts);
    debuglog('Syncing translations done...');
  }

  /**
   *
   * @return {Promise<object>}
   */
  async getLocalBase() {
    const fileContent = await fsPromises.readFile(this.baseFilePath, 'utf8');
    return JSON.parse(fileContent);
  }

  /**
   *
   * @return {Promise<void>}
   */
  async postBaseAndSyncAll() {
    debuglog('Syncing base file...');
    let downloadedEnTranslation = await this.getBaseFile();
    const fileContent = await fsPromises.readFile(this.baseFilePath, 'utf8');

    if (!this.validateJson(fileContent)) {
      throw new Error('Base translations JSON file has empty values.');
    }
    let localEnTranslation = JSON.parse(fileContent);
    let newContent = this.merge({...localEnTranslation}, downloadedEnTranslation);
    newContent = JSON.stringify(newContent, null, this.indentation)
    await fsPromises.writeFile(this.baseFilePath, newContent, 'utf8');
    await this.postBaseFile(newContent);
    debuglog('Base file synced...');
    await this.syncAll();
  }
}

const env = process.env.NODE_ENV || 'local';
const c_projectID = process.env.OS_PROJECT_ID;
const c_secretKey = process.env.OS_SECRET_KEY;
const c_publicKey = process.env.OS_PUBLIC_KEY;
const c_baseFile = process.env.OS_BASE_FILE;
const c_oneSkyBaseFileName = process.env.ONE_SKY_BASE_FILE_NAME;
const c_baseLang = process.env.BASE_LANG;
const envs = new Set(['local', 'stage', 'develop', 'prod']);

if (!c_projectID || !envs.has(env)) {
  console.error(`Error: Invalid OS_PROJECT_ID OR NODE_ENV var`);
  process.exit(0);
}

const c_baseDir = ['src', 'assets', 'i18n'];
const c_indentation = '  ';
const updater = new TranslationsUpdater(
  c_projectID,
  c_secretKey,
  c_publicKey,
  c_baseFile,
  c_oneSkyBaseFileName,
  c_baseLang,
  c_baseDir,
  c_indentation
);



(async(env) => {

  if (env === 'production') {
    await updater.syncAll();
  } else {
    await updater.postBaseAndSyncAll();
  }

})(env);
