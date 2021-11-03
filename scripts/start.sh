#!/bin/bash

cd /var/studybites || exit
docker compose -f docker-compose.base.yml -f docker-compose.prod.yml up --build -d -V
