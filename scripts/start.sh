#!/bin/bash

cd /var/studybites || exit
cp -r /var/letsencrypt/ front/letsencrypt/
docker compose -f docker-compose.yml up --build -d -V
