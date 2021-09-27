![](https://studybites.app/static/logo-3f147537b7f8ab547795ac93e5b10b24.png)

Studybites is an open-source Education Platform (LMS) focused on microlearning and mobile-centric design.

> There is only one way to eat an elephant, a bite at a time.

*Desmond Tutu*

## ⚙️ Local setup

**Development is currently in a very early stage. The solution isn't ready to be used in a production environment.**

Create an .env file locally. You can duplicate .env-example and name the new copy .env. Adapt the variables to your needs.

```
git clone https://github.com/LambdaBird/studybites.git

docker compose up --build

<!-- add test users -->
yarn --cwd ./api seed:run
```

Go to http://localhost:3018 and enter your SB_ADMIN_EMAIL and SB_ADMIN_PASSWORD you've set upper.

## 🤝 Contributing
PR's are welcome

Found a Bug ? Create an Issue.

---

*For any questions and inquiries not related to code, please write to hi@lambdabird.com*
