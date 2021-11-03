FROM node:lts-alpine3.14

WORKDIR /api
COPY package.json yarn.lock ./
RUN yarn
COPY ./ ./
