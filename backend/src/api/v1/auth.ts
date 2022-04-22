import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import bcrypt from 'bcrypt';
import { userRepository } from '../../data-source';
import { User } from '../../entity/User';

interface userAttrs {
  username: string;
  password: string;
  email: string;
  info: string;
}

const auth: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify.post<{ Body: userAttrs }>('/register', {}, async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);

    const user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.info = req.body.info;
    user.passwordHash = hash;

    const savedUser = await userRepository.save(user);
    const { passwordHash, ...omitHash } = savedUser;
    res.code(201).send(omitHash);
  });
};

export default auth;
