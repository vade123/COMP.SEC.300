import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { userRepository } from '../../data-source';

interface ReqParams {
  id: string;
}

const user: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify.get<{ Params: ReqParams }>('/user/:id', {}, async (req, res) => {
    try {
      const user = await userRepository.findOneByOrFail({ id: req.params.id });
      res.send(user.toJSON());
    } catch (err) {
      res.code(404).send({ error: 'Not found' });
    }
  });
};

export default user;
