FROM node:14-alpine

WORKDIR /api

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

CMD ["yarn", "dev"]
