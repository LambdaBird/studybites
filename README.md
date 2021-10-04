![](https://studybites.app/static/logo-3f147537b7f8ab547795ac93e5b10b24.png)

Studybites is an open-source Education Platform (LMS) focused on microlearning and mobile-centric design.

> There is only one way to eat an elephant, a bite at a time.

*Desmond Tutu*

## ⚙️ Local setup

**Development is currently in a very early stage. The solution isn't ready to be used in a production environment.**

Create an .env file locally. You can duplicate .env-example and name the new copy .env. Adapt the variables to your needs.

Environment represents
```dotenv
SB_SEND_MAIL_STATUS=1 
# 1 - Don't send email and only log it to console
# 2 - Don't log to console and only send email
# 3 - Log to console and send email 
SB_MAIL_USER=your_mail@mail.com # Email address which from message will be sent
SB_MAIL_PASSWORD=your_password # Email address password
SB_ADMIN_EMAIL=admin_mail@mail.com # Super admin account email address 
SB_ADMIN_PASSWORD=some_hard_admin_password # Super admin email address password
```

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
