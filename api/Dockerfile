FROM node:14-alpine

ENV DATABASE_URL=${DATABASE_URL}

WORKDIR /api

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .

CMD ["yarn", "run", "dev"]
