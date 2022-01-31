import { UserInputError } from 'apollo-server-errors';
import { mutationField, nonNull, intArg } from 'nexus';

// this api will update the tl_team_id, tl_location_id
export const updateTask = mutationField('updateTask', {
  type: 'TlTasks',
  args: {
    tlTaskId: nonNull(intArg()),
    tlUserId: intArg(),
    tlTeamId: intArg()
  },
  resolve: async (_parent, { tlTaskId, tlUserId, tlTeamId }, ctx) => {
    try {
      let task = await ctx.prisma.tlTasks.findUnique({
        where: {
          id: tlTaskId
        }
      });
      if (!task) {
        throw new UserInputError(`Invalid Task`);
      }
      if (tlTeamId) {
        task = await ctx.prisma.tlTasks.update({
          where: {
            id: task.id
          },
          data: {
            tl_team_id: tlTeamId
          }
        });
      }
      if (tlUserId) {
        task = await ctx.prisma.tlTasks.update({
          where: {
            id: task.id
          },
          data: {
            tl_user_id: tlUserId
          }
        });
      }
      return task;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
});
