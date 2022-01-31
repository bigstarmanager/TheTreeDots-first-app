import { mutationField, nonNull, arg } from 'nexus';
import { UserInputError } from 'apollo-server-express';

export const bulkAssignTask = mutationField('bulkAssignTask', {
  type: 'JSON',
  args: {
    item: nonNull(
      arg({
        type: 'bulkAssignTask'
      })
    )
  },
  resolve: async (_parent, { item }, ctx) => {
    const { taskId, tl_user_id } = item;
    const teamRelation = await ctx.prisma.tlTeamUsers.findMany({
      where: {
        tl_user_id: tl_user_id
      }
    });

    if (!teamRelation) {
      throw new UserInputError('User not tied to any team!');
    }
    const teamId = teamRelation[0].tl_team_id;
    const data = {
      tl_user_id: tl_user_id,
      tl_team_id: teamId
    };
    const idAssigned = await ctx.prisma.tlTasks.updateMany({
      where: {
        id: {
          in: taskId
        }
      },
      data: data
    });
    return idAssigned;
  }
});
