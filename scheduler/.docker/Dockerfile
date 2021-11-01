FROM node:14-alpine

WORKDIR /scheduler

COPY package.json yarn.lock ./
RUN yarn
COPY . .
