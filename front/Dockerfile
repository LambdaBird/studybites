FROM nginx:stable-alpine
COPY build/ /var/www/frontend
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY letsencrypt/ /etc/letsencrypt/
EXPOSE 443
ENTRYPOINT ["nginx", "-g", "daemon off;"]
