FROM node:14-alpine

WORKDIR /front

COPY package.json yarn.lock ./
RUN apk add git
RUN yarn install

COPY . .

CMD ["yarn", "start"]
