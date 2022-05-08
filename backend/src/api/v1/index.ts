import swagger from '@fastify/swagger';
import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import auth from './auth';
import user from './user';

const routes: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify
    .register(auth)
    .register(user)
    .register(swagger, {
      mode: 'static',
      specification: {
        baseDir: '',
        path: './src/api/v1/api.yaml',
      },
      exposeRoute: true,
    });
};

export default routes;
