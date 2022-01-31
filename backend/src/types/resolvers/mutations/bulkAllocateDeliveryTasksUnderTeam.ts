import { mutationField, nonNull, list } from 'nexus';

/*
  Update the tl_tasks table by updating all tl_user_id with the assigned user,
  update tl_team_id with the team the assigned user belongs to and update tl_location_id to the locartion of the team.
  Please make it a bulk allocation as you will need to allocated multiple jobs upon confirmation
*/
export const bulkAllocateDeliveryTasksUnderTeam = mutationField('bulkAllocateDeliveryTasksUnderTeam', {
  type: 'Boolean',
  args: {
    items: nonNull(list('bulkAllocateTasksUnderTeamInput'))
  },
  resolve: async (_parent, { items }, ctx) => {
    const deliveryServiceTaskTypeId = 6;
    async function updateTasks(tl_job_id: number, tl_user_id: number) {
      const teamUsers = await ctx.prisma.tlTeamUsers.findMany({
        select: {
          tl_team_id: true
        },
        where: {
          tl_user_id
        }
      });
      const teamIds = teamUsers.map((t) => t.tl_team_id);
      const teamRelations = await ctx.prisma.tlTeamRelation.findMany({
        select: {
          tl_team_id: true
        },
        where: {
          parent_team_id: {
            in: teamIds
          }
        }
      });
      teamIds.push(...teamRelations.map((t) => t.tl_team_id));
      if (!teamIds.length) return;
      const teamLocations = await ctx.prisma.tlTeamLocations.findMany({
        where: {
          tl_team_id: {
            in: teamIds
          }
        }
      });
      const tl_team_id = teamIds[0];
      // await Promise.all(teamIds.map(async (tl_team_id) => {
      const teamLocation = teamLocations.find((tl) => tl.tl_team_id === tl_team_id);
      const tl_location_id = teamLocation?.tl_location_id || null;
      await ctx.prisma.tlTasks.updateMany({
        where: {
          tl_job_id,
          tl_service_task_type_id: deliveryServiceTaskTypeId
        },
        data: {
          tl_user_id,
          tl_team_id,
          ...(tl_location_id
            ? {
                tl_location_id
              }
            : {})
        }
      });
      //   return true;
      // }));
    }
    await Promise.all(
      items.map(async (item) => {
        await updateTasks(item.tl_job_id, item.tl_user_id);
        return true;
      })
    );

    return true;
  }
});
