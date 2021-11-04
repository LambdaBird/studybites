FROM node:lts-alpine3.14 as build
WORKDIR /front/
COPY package.json yarn.lock ./
RUN apk add git
RUN yarn
COPY ./ ./
RUN yarn build

FROM nginx:stable-alpine
COPY --from=build /front/build/ /usr/share/nginx/html/
COPY --from=build /front/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
