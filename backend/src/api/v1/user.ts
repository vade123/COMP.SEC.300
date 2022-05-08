import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions, FastifyRequest } from 'fastify';
import { userRepository } from '../../data-source';
import { updateOpts } from '../../utils/validators';
import bcrypt from 'bcrypt';
import { IUser, Role } from '../../entity/User';
import { request } from 'http';

interface Params {
  Params: {
    id: string;
  };
}

interface UpdateBody extends IUser {
  password: string;
  passwordConfirm: string;
}

interface ParamsAndBody extends Params {
  Body: UpdateBody;
}

const user: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify
    .decorateRequest('userFromDb', null)
    .decorateRequest('isAdmin', false)
    .addHook('onRequest', async (req, res) => {
      try {
        await req.jwtVerify();
        const user = await userRepository.findOneByOrFail({ id: req.user.id });
        req.isAdmin = user.role === Role.ADMIN;
      } catch (err) {
        res.send(err);
      }
    })
    //.addHook('onRequest', fastify.csrfProtection) //TODO: validating csrf token fails, figure out why
    .addHook('preValidation', (req: FastifyRequest<Params>, res, done) => {
      if (req.user.id !== req.params.id && !req.isAdmin) {
        res.code(403).send({ error: 'forbidden' });
      }
      done();
    })
    .addHook('preHandler', async (req: FastifyRequest<Params>, res) => {
      try {
        if (req.params.id !== 'all') {
          const user = await userRepository.findOneByOrFail({ id: req.params.id });
          req.userFromDb = user;
        }
      } catch (err) {
        res.code(404).send({ error: 'Not found' });
      }
    })
    .get<Params>('/user/:id', {}, async (req, res) => {
      if (req.params.id === 'all' && req.isAdmin) {
        const allUsers = await userRepository.find();
        res.send(allUsers);
      }
      res.send(req.userFromDb);
    })
    //@ts-ignore Joi.ObjectSchema and FastifySchema do not match -> problem with Fastify typing, ignore
    .put<ParamsAndBody>('/user/:id', updateOpts, async (req, res) => {
      const isAdmin = req.user.role === Role.ADMIN;
      const user = req.userFromDb;

      user.email = req.body.email;
      user.username = req.body.username;
      user.info = req.body.info;

      // Only admin can elevate other users to admin.
      if (isAdmin) {
        user.role = req.body.role === 'admin' ? Role.ADMIN : Role.USER;
      }

      // If request body contains a new password, calculate a new hash and clear old token
      const passwordChanged = !req.body.password
        ? false
        : !(await bcrypt.compare(req.body.password, req.userFromDb.passwordHash));
      if (passwordChanged) {
        user.passwordHash = await bcrypt.hash(req.body.password, 10);
        res.clearCookie('token');
      }
      const updatedUser = await userRepository.save(user);
      res.code(200).send(updatedUser);
    })
    .delete<Params>('/user/:id', {}, async (req, res) => {
      await userRepository.delete(req.params.id);
      res.clearCookie('token').code(204).send();
    });
};

export default user;
