import { mutationField, intArg, nonNull, stringArg } from 'nexus';

export const assignAllSelectedServices = mutationField('assignAllSelectedServices', {
  type: 'TlServices',
  args: {
    tl_service_type_id: nonNull(intArg()),
    tl_job_id: nonNull(intArg()),
    tl_team_id: nonNull(intArg())
  },
  resolve: async (_parent, { tl_service_type_id, tl_job_id, tl_team_id }, ctx) => {
    let service = await ctx.prisma.tlServices.findFirst({
      where: {
        tl_service_type_id,
        tl_job_id
      }
    });
    if (!service) {
      service = await ctx.prisma.tlServices.create({
        data: {
          tl_service_type_id,
          tl_job_id,
          tl_team_id
        }
      });
    } else {
      service = await ctx.prisma.tlServices.update({
        where: {
          id: service.id
        },
        data: {
          tl_team_id
        }
      });
    }

    return service;
  }
});
