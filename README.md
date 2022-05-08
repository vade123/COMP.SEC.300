# COMP.SEC.300 Secure Programming

Exercise work for Tampere Uni course COMP.SEC.300 Secure Programming

## Requirements

- [Nodejs](https://nodejs.org/en/) atleast `v17.8.0`
- [Docker](https://www.docker.com/) for easily running the database (not strictly required)

## Getting started

1. Start MariaDB with desired configs, for example: `$ docker run -d --name compsec300-db -e MARIADB_USER=user -e MARIADB_PASSWORD=pw123 -e MARIADB_ROOT_PASSWORD=my-secret-pw -e MARIADB_DATABASE=compsec300-db -p 3306:3306 mariadb:latest`
2. Create `.env`-file from `.env.example` by adding database config for the just created database and other desired configurations
3. Run `npm install` in `backend/` folder to install dependencies
4. Run `npm start` in `backend/` folder to run the app with [ts-node](https://www.npmjs.com/package/ts-node)

## Features related secure programming

- use [TypeORM](https://typeorm.io) object-relational mapping tool
  - No need to write SQL queries manually -> some protection against SQL injections
  - No dependency to a single database provider
- enforce strong password requirements
- use uuids instead of sequential ids
- validate incoming request bodies using [Joi](https://joi.dev/)
- store token in httpOnly cookie
- [cors configuration](https://github.com/fastify/fastify-cors)
- use [csrf protection](https://github.com/fastify/fastify-csrf)
- use [Helmet](https://github.com/fastify/fastify-helmet) for security headers

## References

- https://codahale.com/how-to-safely-store-a-password/
- https://docs.microsoft.com/en-us/microsoft-365/admin/misc/password-policy-recommendations?view=o365-worldwide
- https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- https://owasp.org/www-project-top-ten/
- https://github.com/fastify/fastify-cookie#securing-the-cookie
- https://cheatcode.co/tutorials/how-to-implement-secure-httponly-cookies-in-node-js-with-express
