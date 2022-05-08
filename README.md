# COMP.SEC.300 Secure Programming

Exercise work for Tampere Uni course COMP.SEC.300 Secure Programming. Simple CRUD API with authentication for managing users.

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
- hash password using [bcrypt](https://www.npmjs.com/package/bcrypt), store only the hash
  - use 10 rounds of salt, autogenerate salt
- use uuids instead of sequential ids
  - impossible to deduct anything from the id
- validate incoming request bodies using [Joi](https://joi.dev/)
- store jwt token in httpOnly cookie, expire token in 1h
- use secure cookies
- [cors configuration](https://github.com/fastify/fastify-cors)
- use [csrf protection](https://github.com/fastify/fastify-csrf)
- use [Helmet](https://github.com/fastify/fastify-helmet) for security headers
  - otherwise use recommended defaults (i.e. everything enabled), but configure swagger to work

## Testing

Lots of manual testing using [postman](https://www.postman.com/).

## References

Some references used in this work, not an exhaustive list:

- https://www.fastify.io/
- https://codahale.com/how-to-safely-store-a-password/
- https://docs.microsoft.com/en-us/microsoft-365/admin/misc/password-policy-recommendations?view=o365-worldwide
- https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- https://owasp.org/www-project-top-ten/
- https://github.com/fastify/fastify-cookie#securing-the-cookie
- https://cheatcode.co/tutorials/how-to-implement-secure-httponly-cookies-in-node-js-with-express

## Open issues / further development

- Error responses from the API are not very user-friendly
  - Joi and Fastify weren't playing together nicely, resulting in validation fails being `500 Internal server error`s instead of `400 Bad request`s
    - would require implementing custom parsing for the error message or switching to a different validating library (Fastify uses `Ajv` by default).
- Refresh token flow, currently only access token is implemented
- CSRF token should be generated before any other requests, currently generated at login
- Admins have power to do basically anything, which is not very feasible and also probably not GDPR-safe
