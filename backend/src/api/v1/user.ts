import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions, FastifyRequest } from 'fastify';
import { userRepository } from '../../data-source';

interface ReqParams {
  Params: {
    id: string;
  };
}

const user: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify
    .decorateRequest('userFromDb', null)
    .addHook('onRequest', async (req, res) => {
      try {
        await req.jwtVerify();
      } catch (err) {
        res.send(err);
      }
    })
    //.addHook('onRequest', fastify.csrfProtection) //TODO: validating csrf token fails, figure out why
    .addHook('preValidation', (req: FastifyRequest<ReqParams>, res, done) => {
      if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        res.code(403).send({ error: 'forbidden' });
      }
      done();
    })
    .addHook('preHandler', async (req: FastifyRequest<ReqParams>, res) => {
      try {
        const user = await userRepository.findOneByOrFail({ id: req.params.id });
        req.userFromDb = user;
      } catch (err) {
        res.code(404).send({ error: 'Not found' });
      }
    })
    .get<ReqParams>('/user/:id', {}, async (req, res) => {
      res.send(req.userFromDb.toJSON());
    })
    .put<ReqParams>('/user/:id', {}, async (req, res) => {
      console.log(req.userFromDb);
    });
};

export default user;
