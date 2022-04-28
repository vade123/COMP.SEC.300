import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions, FastifyRequest } from 'fastify';
import { userRepository } from '../../data-source';

interface ReqParams {
  Params: {
    id: string;
  };
}

const user: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify
    .addHook('onRequest', async (req, res) => {
      try {
        await req.jwtVerify();
      } catch (err) {
        res.send(err);
      }
    })
    // .addHook('onRequest', fastify.csrfProtection) TODO: validating csrf token fails, figure out why
    .addHook('preValidation', (req: FastifyRequest<ReqParams>, res, done) => {
      if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        res.code(403).send({ error: 'forbidden' });
      }
      done();
    });

  fastify.get<ReqParams>('/user/:id', {}, async (req, res) => {
    try {
      const user = await userRepository.findOneByOrFail({ id: req.params.id });
      res.send(user.toJSON());
    } catch (err) {
      res.code(404).send({ error: 'Not found' });
    }
  });
};

export default user;
