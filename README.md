# COMP.SEC.300 Secure Programming

Exercise work for Tampere Uni course COMP.SEC.300 Secure Programming

## Getting started

1. Start MariaDB with desired configs, for example: `$ docker run -d --name compsec300-db -e MARIADB_USER=user -e MARIADB_PASSWORD=pw123 -e MARIADB_ROOT_PASSWORD=my-secret-pw -e MARIADB_DATABASE=compsec300-db -p 3306:3306 mariadb:latest`
2. Create `.env`-file from `.env.example` by adding database config for the just created database
3. Run `npm install` to install dependencies
4. Run `npm start` to run the app with `ts-node`

## Features

- use [recommended](https://github.com/tsconfig/bases/blob/main/bases/node17.json) tsconfig for node17
- use [TypeORM](https://typeorm.io) object-relational mapping tool
  - No need to write SQL queries manually -> some protection against SQL injections
  - No dependency to a single database provider
