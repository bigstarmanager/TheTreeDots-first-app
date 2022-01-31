import { ApolloServer } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import * as http from 'http';
import { createApp } from './app';
import { createContext } from './context';
import { schema } from './schema';
import { permissions } from './types/middlewares';
import { PrismaClient } from '@treedots/prisma';

const createServer = (prisma?: PrismaClient): http.Server => {
  const app = createApp();
  const server = http.createServer(app);
  const apollo = new ApolloServer({
    schema: applyMiddleware(schema, permissions),
    context: createContext(prisma),
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production',
    // tracing: process.env.NODE_ENV !== 'production',
    formatError: (err) => {
      /** Don't give the specific errors to the client. */
      if (err.extensions.code === 'INTERNAL_SERVER_ERROR') err.message = 'Internal server error';

      /** Don't give error detail in production environment */
      return process.env.NODE_ENV === 'production' ? Error(err.message) : err;
    },
    plugins: []
  });
  apollo.applyMiddleware({ app });

  apollo.installSubscriptionHandlers(server);

  return server;
};

module.exports = { createServer };
