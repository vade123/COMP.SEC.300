# COMP.SEC.300 Secure Programming

Exercise work for Tampere Uni course COMP.SEC.300 Secure Programming

## Getting started

1. Start MariaDB with desired configs, for example: `$ docker run -d --name compsec300-db -e MARIADB_USER=user -e MARIADB_PASSWORD=pw123 -e MARIADB_ROOT_PASSWORD=my-secret-pw -e MARIADB_DATABASE=compsec300-db -p 3306:3306 mariadb:latest`
2. Create `.env`-file from `.env.example` by adding database config for the just created database
3. Run `npm install` to install dependencies
4. Run `npm start` to run the app with `ts-node`

## Features related secure programming

- use [TypeORM](https://typeorm.io) object-relational mapping tool
  - No need to write SQL queries manually -> some protection against SQL injections
  - No dependency to a single database provider
- enforce strong password requirements
- use uuids instead of sequential ids
- validate incoming request bodies
- store token in httpOnly cookie
- cors configuration
- use csrf token
- use helmet for security headers

## References

- https://codahale.com/how-to-safely-store-a-password/
- https://docs.microsoft.com/en-us/microsoft-365/admin/misc/password-policy-recommendations?view=o365-worldwide
- https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- https://owasp.org/www-project-top-ten/
- https://github.com/fastify/fastify-cookie#securing-the-cookie
