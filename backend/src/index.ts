import 'dotenv/config';
import fastify from 'fastify';
import { AppDataSource } from './data-source';

AppDataSource.initialize()
  .then(async () => {
    const server = fastify();

    server.get('/ping', async (request, reply) => {
      return 'pong\n';
    });

    server.listen(parseInt(process.env.PORT!), (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  })
  .catch(e => console.log(e));
