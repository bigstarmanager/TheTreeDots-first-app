import { mutationField, nonNull, intArg } from 'nexus';

export const deleteUser = mutationField('deleteUser', {
  type: 'Boolean',
  args: {
    id: nonNull(intArg())
  },
  resolve: async (_parent, { id }, ctx) => {
    const user = await ctx.prisma.tlUsers.findFirst({
      where: {
        id: id
      }
    });

    if (!user) return false;

    await ctx.prisma.tlUsers.update({
      where: {
        id: id
      },
      data: {
        soft_delete: true
      }
    });

    return true;
  }
});
