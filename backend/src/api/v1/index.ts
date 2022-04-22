import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import auth from './auth';
import user from './user';

const routes: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify.register(auth);
  fastify.register(user);
};

export default routes;
