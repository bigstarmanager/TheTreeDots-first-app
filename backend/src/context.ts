import * as dotenv from 'dotenv';
import { Request } from 'apollo-server-express';
import { PrismaClient } from '@treedots/prisma';

dotenv.config();

const { NODE_ENV, JWT_SECRET } = process.env;

export interface Context {
  request: Request & any;
  prisma: PrismaClient;
  appSecret: string;
}

const prismaClientPropertyName = `__prevent-name-collision__prisma`;
type GlobalThisWithPrismaClient = typeof globalThis & {
  [prismaClientPropertyName]: PrismaClient;
};
const getPrismaClient = () => {
  if (NODE_ENV === 'production') {
    return new PrismaClient();
  } else {
    const newGlobalThis = globalThis as GlobalThisWithPrismaClient;
    if (!newGlobalThis[prismaClientPropertyName]) {
      newGlobalThis[prismaClientPropertyName] = new PrismaClient({
        log: ['query']
      });
    }
    return newGlobalThis[prismaClientPropertyName];
  }
};

const prisma = getPrismaClient();

/** Development purposes */
// prisma.$on('query', e => {
//   console.log(e)
// })

export const createContext = (prismaClient?: PrismaClient) => (request: Request): Context => {
  return {
    request,
    prisma: prismaClient || prisma,
    appSecret: JWT_SECRET
  };
};
