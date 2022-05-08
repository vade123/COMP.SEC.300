import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import bcrypt from 'bcrypt';
import { userRepository } from '../../data-source';
import { IUser, User } from '../../entity/User';
import { registerOpts, loginOpts } from '../../utils/validators';
import { cookieOpts } from '../../index';

export interface RegisterBody extends Omit<IUser, 'id'> {
  password: string;
  passwordConfirm: string;
}

export interface LoginBody {
  username: string;
  password: string;
}

const auth: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  //@ts-ignore Joi.ObjectSchema and FastifySchema do not match -> problem with Fastify typing, ignore
  fastify.post<{ Body: RegisterBody }>('/register', registerOpts, async (req, res) => {
    const userExists = await userRepository.findOneBy({ username: req.body.username });
    if (userExists) {
      res.code(400).send({ statusCode: 400, error: 'Bad request', message: 'Username already taken' });
    }

    const hash = await bcrypt.hash(req.body.password, 10);

    const user = new User();
    user.email = req.body.email;
    user.username = req.body.username;
    user.info = req.body.info;
    user.passwordHash = hash;

    const savedUser = await userRepository.save(user);
    const { passwordHash, ...omitHash } = savedUser;
    res.code(201).send(omitHash);
  });

  //@ts-ignore Joi.ObjectSchema and FastifySchema do not match -> problem with Fastify typing, ignore
  fastify.post<{ Body: LoginBody }>('/login', loginOpts, async (req, res) => {
    const user = await userRepository.findOneBy({ username: req.body.username });
    const passwordCorrect = !user ? false : await bcrypt.compare(req.body.password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      res.code(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Bad credentials' });
    }

    const token = fastify.jwt.sign(user?.toJSON()!, { expiresIn: '1h' });

    await res.generateCsrf(cookieOpts);
    res.setCookie('token', token, cookieOpts).code(200).send({ username: user?.username, id: user?.id });
  });
};

export default auth;
