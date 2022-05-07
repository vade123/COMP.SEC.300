import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions, FastifyRequest } from 'fastify';
import { userRepository } from '../../data-source';
import { updateOpts } from '../../utils/validators';
import bcrypt from 'bcrypt';
import { IUser, Role } from '../../entity/User';
import { cookieOpts } from '../..';

interface GetParams {
  Params: {
    id: string;
  };
}

interface UpdateBody extends IUser {
  password: string;
  passwordConfirm: string;
}

interface PutParams extends GetParams {
  Body: UpdateBody;
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
    .addHook('preValidation', (req: FastifyRequest<GetParams>, res, done) => {
      if (req.user.id !== req.params.id && req.user.role !== Role.ADMIN) {
        res.code(403).send({ error: 'forbidden' });
      }
      done();
    })
    .addHook('preHandler', async (req: FastifyRequest<GetParams>, res) => {
      try {
        const user = await userRepository.findOneByOrFail({ id: req.params.id });
        req.userFromDb = user;
      } catch (err) {
        res.code(404).send({ error: 'Not found' });
      }
    })
    .get<GetParams>('/user/:id', {}, async (req, res) => {
      res.send(req.userFromDb);
    })
    //@ts-ignore Joi.ObjectSchema and FastifySchema do not match -> problem with Fastify typing, ignore
    .put<PutParams>('/user/:id', updateOpts, async (req, res) => {
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
    });
};

export default user;
