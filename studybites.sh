#!/bin/bash

help() {
  echo "Mobile-first microlearning LMS

Usage: studybites COMMAND

Available commands:
  down-dev            Remove development containers
  help                Print help information and quit
  migrate             Make a migration
  psql-dev            Connect to the StudyBites development database console
  start-dev           Start an instance in the development mode
  start-headless      Start an instance in the headless mode
  test                Run unit and integration tests"

  exit 0
}

down-dev() {
  if docker-compose -f base.dev.yml -f backend.dev.yml -f frontend.dev.yml down -v --remove-orphans; then
    exit 0
  fi
  exit 1
}

migrate() {
  if docker exec -it studybites_api_1 yarn migrate; then
    exit 0
  fi
  exit 1
}

psql-dev() {
  if docker exec -it studybites_db_1 psql -d studybites -U sb-admin; then
    exit 0
  fi
  exit 1
}

start-dev() {
  if docker-compose -f base.dev.yml -f backend.dev.yml -f frontend.dev.yml up --build; then
    exit 0
  fi
  exit 1
}

start-headless() {
  if docker-compose -f base.dev.yml -f backend.dev.yml up --build; then
    exit 0
  fi
  exit 1
}

test() {
  if yarn --cwd ./api test:unit; then
    docker-compose -p test -f base.dev.yml -f backend.test.yml up -d --build
    docker logs test_api_1 -f
    STATUS="$(docker inspect test_api_1 --format='{{.State.ExitCode}}')"
    docker-compose -p test -f base.dev.yml -f backend.test.yml down -v --remove-orphans;

    if [ "$STATUS" -ne 0 ]; then
      exit 1;
    else
      exit 0;
    fi
  fi
  exit 1
}

CMD="$1"

case "$CMD" in
down-dev)
  down-dev
  ;;
help)
  help
  ;;
migrate)
  migrate
  ;;
psql-dev)
  psql-dev
  ;;
start-dev)
  start-dev
  ;;
start-headless)
  start-headless
  ;;
test)
  test
  ;;
*)
  help
  ;;
esac
