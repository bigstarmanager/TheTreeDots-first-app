FROM node:14.17.0-alpine

RUN mkdir /treedots
WORKDIR /treedots

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont 

COPY . .

RUN apk add --no-cache --virtual .gyp \
        libsecret-dev \
    && node /treedots/common/scripts/install-run-rush.js install --purge --bypass-policy \
    && yarn --cwd /treedots/packages/prisma run generate \
    && node /treedots/common/scripts/install-run-rush.js build --to @treedots/prisma \
    && node /treedots/common/scripts/install-run-rush.js build --to @treedots/tookan \
    && node /treedots/common/scripts/install-run-rush.js build --to @treedots/3pl-graphql \
    && apk del .gyp

WORKDIR /treedots/apps/3pl-graphql

# setting for puppeteer and chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

EXPOSE 80
CMD PORT=80 node /treedots/common/scripts/install-run-rushx.js start
