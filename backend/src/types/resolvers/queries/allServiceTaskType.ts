import { queryField, intArg } from 'nexus';

export const allServiceTaskType = queryField((t) => {
  t.list.field('allServiceTaskType', {
    type: 'TlServiceTaskType',
    args: {
      service_type_id: intArg()
    },
    resolve: (_, args, context) => {
      const where: { tl_service_type_id: number } = {
        tl_service_type_id: undefined
      };

      if (args.service_type_id) {
        where.tl_service_type_id = args.service_type_id;
      }

      return context.prisma.tlServiceTaskType.findMany({
        where
      });
    }
  });
});
