import { CookieSerializeOptions } from 'fastify-csrf';

export const cookieOpts: CookieSerializeOptions = {
  domain: 'localhost',
  path: '/',
  secure: false, // set to true when using HTTPS
  httpOnly: true,
  sameSite: true,
  signed: true,
};
