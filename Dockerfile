FROM node:14-alpine as build
ARG BUILD_CONTEXT

WORKDIR /base

COPY package.json .
COPY yarn.lock .
COPY ./packages/$BUILD_CONTEXT/package.json packages/$BUILD_CONTEXT/
COPY ./packages/sb-config/package.json packages/sb-config/package.json

RUN yarn install

COPY ./packages/$BUILD_CONTEXT packages/$BUILD_CONTEXT
COPY ./packages/sb-config packages/sb-config
