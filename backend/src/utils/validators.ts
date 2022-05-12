import Joi, { ObjectSchema } from 'joi';
import passwordComplexity, { ComplexityOptions } from 'joi-password-complexity';
import { FastifyRouteSchemaDef } from 'fastify/types/schema';
import { LoginBody, RegisterBody } from '../api/v1/auth';

const validatorCompiler = ({ schema, method, url, httpPart }: FastifyRouteSchemaDef<ObjectSchema>) => {
  return (data: RegisterBody | LoginBody) => Joi.assert(data, schema);
};

const passwordOpts: ComplexityOptions = {
  min: 10,
  max: 40,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
};

const registerOpts = {
  schema: {
    body: Joi.object()
      .keys({
        username: Joi.string().alphanum().min(4).max(16).required(),
        password: passwordComplexity(passwordOpts).required(),
        passwordConfirm: Joi.ref('password'),
        email: Joi.string().email().required(),
        info: Joi.string().empty(''),
      })
      .with('password', 'passwordConfirm')
      .required(),
  },
  validatorCompiler,
};

const updateOpts = {
  schema: {
    body: Joi.object()
      .keys({
        id: Joi.string(),
        username: Joi.string().alphanum().min(4).max(16).required(),
        password: passwordComplexity(passwordOpts),
        passwordConfirm: Joi.ref('password'),
        email: Joi.string().email().required(),
        info: Joi.string().empty(''),
        role: Joi.string(),
      })
      .with('password', 'passwordConfirm')
      .required(),
  },
  validatorCompiler,
};

const loginOpts = {
  schema: {
    body: Joi.object()
      .keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
      })
      .required(),
  },
  validatorCompiler,
};

export { registerOpts, loginOpts, updateOpts };
