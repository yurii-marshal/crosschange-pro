# default value is empty in order to use the command from bitbucket pipeline
# to activate preset profile use AWS_CLI_PROFILE="--profile test"
AWS_CLI_PROFILE:=

define create_invalidation
    aws cloudfront create-invalidation --distribution-id $(1) --paths "/*" ${AWS_CLI_PROFILE}
endef

config-basic-auth:
	sed -i "s#assetsAuth.*#assetsAuth: '${BASIC_AUTH}'#g" src/environments/environment.${ENV}.ts

build-pro-frontend:
	npm install
	npm run build:${ENV}

deploy-pro-frontend:
	# upload all except css, js, json, html, svg, jpg, png, ttf, eot, otf
	aws s3 sync --delete ./dist ${S3_BUCKET} --exclude "*.css" --exclude "*.js" --exclude "*.json"  --exclude "*.html" --exclude "*.svg" --exclude "*.jpg" --exclude "*.png" --exclude "*.ttf" --exclude "*.eot" --exclude "*.otf"
	# upload css, js, json with predefined headers
	aws s3 sync --delete ./dist ${S3_BUCKET} --exclude "*" --include "*.css" --include "*.js" --include "*.json" --content-encoding gzip --cache-control max-age=31536000,dist
	# upload html with predefined headers
	aws s3 sync --delete ./dist ${S3_BUCKET} --exclude "*" --include "*.html" --content-encoding gzip --cache-control no-cache
	# upload svg, jpg, png, ttf, eot, otf with predefined headers
	aws s3 sync --delete ./dist ${S3_BUCKET} --exclude "*" --include "*.svg" --include "*.jpg"  --include "*.png" --include "*.eot" --include "*.ttf" --include "*.otf" --cache-control max-age=31536000,dist	
	$(call create_invalidation,${CLOUDFRONT_DISTRIBUTION_ID})

slack-notification:
	curl -s -X POST https://hooks.slack.com/services/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 \
	-H "content-type:application/json" \
    -d '{"text":"[crosschange-pro-frontend] [${BITBUCKET_BRANCH}] ${MESSAGE}"}'