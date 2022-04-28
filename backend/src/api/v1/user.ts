import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { userRepository } from '../../data-source';

interface ReqParams {
  id: string;
}

const user: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify.addHook('onRequest', async (req, res) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      res.send(err);
    }
  });

  fastify.get<{ Params: ReqParams }>('/user/:id', {}, async (req, res) => {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      res.code(403).send({ error: 'forbidden' });
    }
    try {
      const user = await userRepository.findOneByOrFail({ id: req.params.id });
      res.send(user.toJSON());
    } catch (err) {
      res.code(404).send({ error: 'Not found' });
    }
  });
};

export default user;
