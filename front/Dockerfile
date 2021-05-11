FROM node:14-alpine

WORKDIR /front

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

CMD ["yarn", "start"]
