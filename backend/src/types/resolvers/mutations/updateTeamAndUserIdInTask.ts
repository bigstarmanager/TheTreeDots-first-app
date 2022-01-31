import { mutationField, intArg, nonNull } from 'nexus';
import { UserInputError } from 'apollo-server-express';

export const updateTeamAndUserIdInTask = mutationField('updateTeamAndUserIdInTask', {
  type: 'TlTasks',
  args: {
    taskId: nonNull(intArg()),
    tl_user_id: nonNull(intArg())
  },
  resolve: async (_parent, { taskId, tl_user_id }, ctx) => {
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
    const updatedTeamAndUserId = await ctx.prisma.tlTasks.update({
      where: {
        id: taskId
      },
      data: data
    });
    return updatedTeamAndUserId;
  }
});
