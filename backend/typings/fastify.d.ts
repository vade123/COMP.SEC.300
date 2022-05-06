import fastify from 'fastify';

declare module 'fastify' {
  interface FastifyInstance<HttpServer = Server, HttpRequest = IncomingMessage, HttpResponse = ServerResponse> {
    userFromDb: any;
  }
}
