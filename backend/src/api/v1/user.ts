import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';

const user: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify.get('/health', {}, async (req, res) => {
    return 'ok\n';
  });
};

export { user };
