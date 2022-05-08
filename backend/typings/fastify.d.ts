import fastify from 'fastify';
import { User } from '../src/entity/User';

declare module 'fastify' {
  interface FastifyRequest {
    userFromDb: User;
    isAdmin: Boolean;
  }
}
