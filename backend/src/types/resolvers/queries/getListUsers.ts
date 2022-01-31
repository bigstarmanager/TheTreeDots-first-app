import { queryField, intArg, nonNull } from 'nexus';
import { validatorPaging } from '../../utils/validator';

export const getListUsers = queryField((t) => {
  t.list.field('getListUsers', {
    type: 'TlUsers',
    args: {
      tl_team_id: nonNull(intArg()),
      page: intArg(),
      limit: intArg()
    },
    resolve: async (_parent, { tl_team_id, page, limit }, ctx) => {
      validatorPaging(page, limit);
      const take = limit;
      const skip = (page - 1) * limit;

      const users = await ctx.prisma.tlUsers.findMany({
        where: {
          TlTeamUsers: {
            every: {
              tl_team_id: {
                equals: tl_team_id
              }
            }
          }
        },
        skip,
        take
      });

      return users;
    }
  });
});
