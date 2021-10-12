![](https://studybites.app/static/logo-3f147537b7f8ab547795ac93e5b10b24.png)

Studybites is an open-source Education Platform (LMS) focused on microlearning and mobile-centric design.

> There is only one way to eat an elephant, a bite at a time.

*Desmond Tutu*

## ⚙️ Local setup

**Development is currently in a very early stage. The solution isn't ready to be used in a production environment.**


```
# clone the StudyBites repository
git clone https://github.com/LambdaBird/studybites.git

# run the development version
./studybites.sh start-dev

# run the headless version
./studybites start-headless

# append latest migrations
./studybites.sh migrate

# run tests
./studybites.sh test

# remove containers
./studybites.sh down-dev

# add test users
yarn --cwd ./api seed:run
```

Create an .env file locally. You can duplicate .env-example and name the new copy .env. Adapt the variables to your needs.

```
# PostgreSQL service hostname, do not change it without updating the bace.dev.yml
POSTGRES_HOST=db 

# PostgreSQL development database name
POSTGRES_DB=studybites 

# PostgreSQL test database name
POSTGRES_TEST_DB=studybites-test

# PostgreSQL username
POSTGRES_USER=sb-admin

# PostgreSQL password
POSTGRES_PASSWORD=sb-password

# Backend port
API_PORT=3017

# StudyBites admin email
SB_ADMIN_EMAIL=admin@test.io

# StudyBites admin password
SB_ADMIN_PASSWORD=passwd3

# JSON Web Token secret
JWT_SECRET=tvXqYGduhyMw28EzyBxaGrFP8zQsmRG93GZHrmADmHsU9WwB7nbULUsJ98aAqWzM 

# PostgreSQL DSN for the development database
POSTGRES_URI=postgres://sb-admin:sb-password@db:5432/studybites

# PostgreSQL DSN for the test database
POSTGRES_TEST_URI=postgres://sb-admin:sb-password@db:5432/studybites-test 

# Frontend port
FRONT_PORT=3018 
```

Go to http://localhost:3018 and enter your SB_ADMIN_EMAIL and SB_ADMIN_PASSWORD you've set upper.

## 🤝 Contributing
PR's are welcome

Found a Bug ? Create an Issue.

---

*For any questions and inquiries not related to code, please write to hi@lambdabird.com*
