import 'dotenv/config';
import fastify, { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';
import { AppDataSource } from './data-source';
import routes from './api/v1';

AppDataSource.initialize()
  .then(async () => {
    const server: FastifyInstance = fastify();
    server
      .register(jwt, { secret: process.env.JWT_SECRET! })
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
