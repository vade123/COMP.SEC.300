import 'dotenv/config';
import fastify, { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import { AppDataSource } from './data-source';
import routes from './api/v1';

const SECRET = process.env.SECRET!;

AppDataSource.initialize()
  .then(async () => {
    const server: FastifyInstance = fastify();
    server
      .register(cors, {
        origin: true,
        methods: ['GET', 'POST'],
      })
      .register(cookie, { secret: SECRET })
      .register(jwt, {
        secret: SECRET,
        cookie: {
          cookieName: 'token',
          signed: false,
        },
      })
      .register(routes, { prefix: '/api/v1' })
      .get('/health', {}, async (req, res) => {
        return 'ok\n';
      })
      .listen(parseInt(process.env.PORT!), (err, address) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        console.log(`Server listening at ${address}`);
      });
  })
  .catch(e => console.log(e));
