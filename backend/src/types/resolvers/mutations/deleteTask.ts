import { UserInputError } from 'apollo-server-errors';
import { mutationField, nonNull, arg, intArg } from 'nexus';

export const deleteTask = mutationField('deleteTask', {
  type: 'Boolean',
  args: {
    taskId: nonNull(intArg())
  },
  resolve: async (_parent, { taskId }, ctx) => {
    try {
      const task = await ctx.prisma.tlTasks.findUnique({
        where: {
          id: taskId
        }
      });
      if (!task) {
        throw new UserInputError(`Invalid Job`);
      }
      await ctx.prisma.tlTasks.delete({
        where: {
          id: taskId
        }
      });
      return true;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
});
