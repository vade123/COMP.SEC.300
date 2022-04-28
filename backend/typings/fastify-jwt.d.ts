import '@fastify/jwt';

interface RequestUser {
  id: string;
  role: string;
  username: string;
  email: string;
  info: string;
  iam: number;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: Record<string, any>; // payload type is used for signing and verifying
    user: RequestUser; // user type is return type of `request.user` object
  }
}
