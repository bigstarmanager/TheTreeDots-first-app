import { queryField, intArg } from 'nexus';

export const allServiceType = queryField((t) => {
  t.list.field('allServiceType', {
    type: 'TlServiceType',
    args: {
      tl_service_type_id: intArg()
    },
    resolve: (_, args, context) => {
      return context.prisma.tlServiceType.findMany();
    }
  });
});
