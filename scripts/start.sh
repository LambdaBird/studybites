#!/bin/bash

cd /var/studybites || exit
cp -r /var/letsencrypt/ front/
docker compose -f docker-compose.base.yml -f docker-compose.prod.yml up --build -d -V
