FROM nginx:stable-alpine
COPY build/ /var/www/frontend
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
