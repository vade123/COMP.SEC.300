import 'dotenv/config';
import fastify, { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import csrf from 'fastify-csrf';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { AppDataSource } from './data-source';
import routes from './api/v1';
import { cookieOpts } from './utils/cookieOpts';
import { initAdmin } from './utils/initAdmin';

const SECRET = process.env.SECRET!;

AppDataSource.initialize()
  .then(async () => {
    initAdmin();

    const server: FastifyInstance = fastify();
    await server
      .register(cors, {
        origin: ['*'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      })
      .register(rateLimit, { global: true, max: 50, timeWindow: '1 minute' })
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
      .register(routes, { prefix: '/api/v1' });

    server
      .setNotFoundHandler({ preHandler: server.rateLimit() }, (req, res) =>
        res.code(404).send({ statusCode: 404, error: 'Not found', message: `Path "${req.url}" not found` })
      )
      .listen(process.env.PORT ?? 8080, (err, address) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        console.log(`Server listening at ${address}`);
      });
  })
  .catch(e => console.log(e));
