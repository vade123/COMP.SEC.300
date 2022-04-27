import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import bcrypt from 'bcrypt';
import { userRepository } from '../../data-source';
import { User } from '../../entity/User';
import Joi, { ObjectSchema } from 'joi';
import passwordComplexity, { ComplexityOptions } from 'joi-password-complexity';
import { FastifyRouteSchemaDef } from 'fastify/types/schema';

interface userAttrs {
  username: string;
  password: string;
  passwordConfirm: string;
  email: string;
  info: string;
}

const passwordOpts: ComplexityOptions = {
  min: parseInt(process.env.PASSWORD_MIN_LENGTH!),
  max: 40,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
};

const postOpts = {
  schema: {
    body: Joi.object()
      .keys({
        username: Joi.string().alphanum().min(4).max(16).required(),
        password: passwordComplexity(passwordOpts).required(),
        passwordConfirm: Joi.ref('password'),
        email: Joi.string().email().required(),
        info: Joi.string(),
      })
      .with('password', 'passwordConfirm')
      .required(),
  },
  validatorCompiler: ({ schema, method, url, httpPart }: FastifyRouteSchemaDef<ObjectSchema>) => {
    return (data: userAttrs) => Joi.assert(data, schema);
  },
};

const auth: FastifyPluginAsync = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  //@ts-ignore Joi.ObjectSchema and FastifySchema do not match -> problem with Fastify typing, ignore
  fastify.post<{ Body: userAttrs }>('/register', postOpts, async (req, res) => {
    const userExists = await userRepository.findOneBy({ username: req.body.username });
    if (userExists) {
      res.code(400).send({ error: 'username already taken' });
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
};

export default auth;
