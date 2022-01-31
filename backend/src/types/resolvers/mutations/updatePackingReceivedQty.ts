import { UserInputError } from 'apollo-server-errors';
import { intArg, mutationField, nonNull } from 'nexus';

export const updatePackingReceivedQty = mutationField('updatePackingReceivedQty', {
  type: 'TlTasks',
  args: {
    tlTaskId: nonNull(intArg()),
    newReceivedQty: nonNull(intArg())
  },
  resolve: async (_, args, ctx) => {
    const getCurrentReceivedQty = await ctx.prisma.tlTasks.findFirst({
      where: {
        id: args.tlTaskId
      }
    });
    if (!getCurrentReceivedQty) {
      throw new UserInputError(`Invalid Task`);
    }
    if (getCurrentReceivedQty.received_quantity === getCurrentReceivedQty.quantity) {
      throw new UserInputError(`Cant Update Status, its already Completed!`);
    }
    // if progress qty equal order quantity status will be Completed
    // else if progress qty bigger than 0 and less then order quantity status will be In Progress
    // else just assume status as Assigned
    if (args.newReceivedQty > getCurrentReceivedQty.quantity) {
      throw new UserInputError(`Invalid Qty!`);
    }
    const newTaskStatusId =
      args.newReceivedQty === getCurrentReceivedQty.quantity
        ? 4
        : args.newReceivedQty > 0 && args.newReceivedQty < getCurrentReceivedQty.quantity
        ? 3
        : 2;
    return ctx.prisma.tlTasks.update({
      data: {
        received_quantity: args.newReceivedQty,
        TlTaskStatuses: {
          connect: {
            id: newTaskStatusId
          }
        }
      },
      where: {
        id: args.tlTaskId
      }
    });
  }
});
