import 'dotenv/config';
import fastify, { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';
import cookie, { CookieSerializeOptions } from '@fastify/cookie';
import cors from '@fastify/cors';
import csrf from 'fastify-csrf';
import helmet from '@fastify/helmet';
import { AppDataSource } from './data-source';
import routes from './api/v1';

const SECRET = process.env.SECRET!;

export const cookieOpts: CookieSerializeOptions = {
  domain: 'localhost',
  path: '/',
  secure: false, // set to true when using HTTPS
  httpOnly: true,
  sameSite: true,
  signed: true,
};

AppDataSource.initialize()
  .then(async () => {
    const server: FastifyInstance = fastify();
    server
      .register(cors, {
        origin: ['*'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      })
      .register(cookie, { secret: SECRET })
      .register(csrf, { cookieOpts })
      .register(jwt, {
        secret: SECRET,
        cookie: {
          cookieName: 'token',
          signed: true,
        },
      })
      .register(helmet, {
        contentSecurityPolicy: {
          directives: {
            defaultSrc: [`'self'`],
            styleSrc: [`'self'`, `'unsafe-inline'`],
            imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
            scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          },
        },
      })
      .register(routes, { prefix: '/api/v1' })
      .get('/health', {}, async () => {
        return 'ok\n';
      })
      .listen(process.env.PORT ?? 8080, (err, address) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        console.log(`Server listening at ${address}`);
      });
  })
  .catch(e => console.log(e));
