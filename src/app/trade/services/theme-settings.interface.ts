export enum ITheme {
  Light = 'theme-light',
  Dark = 'theme-dark',
}

export enum ILayout {
  Classic = 'classic',
  Pro = 'pro',
  Fullscreen = 'fullscreen',
}

export interface IThemeOptions {
  name: ITheme;
  layout: ILayout;
}
