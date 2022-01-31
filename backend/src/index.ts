import * as dotenv from 'dotenv';

dotenv.config();

/* eslint-disable @typescript-eslint/no-var-requires */
const { createServer } = require('./server');

const { PORT = 5400 } = process.env;

createServer().listen({ port: PORT }, () => {
  process.stdout.write(
    `🚀 Server ready (environment: ${process.env.NODE_ENV}) at http://localhost:${PORT}/graphql\n`
  );
});
