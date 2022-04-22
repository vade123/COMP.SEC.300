import 'dotenv/config';
import fastify, { FastifyInstance } from 'fastify';
import { AppDataSource } from './data-source';
import routes from './api/v1';

AppDataSource.initialize()
  .then(async () => {
    const server: FastifyInstance = fastify();

    server.get('/health', {}, async (req, res) => {
      return 'ok\n';
    });

    server.register(routes, { prefix: '/api/v1' });

    server.listen(parseInt(process.env.PORT!), (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  })
  .catch(e => console.log(e));
