import { queryField } from 'nexus';

export const allActiveCollectionJobsUnderPrimaryTeam = queryField((t) => {
  t.list.field('allActiveCollectionJobsUnderPrimaryTeam', {
    type: 'TlJobsCollection',
    resolve: async (_parent, _args, ctx) => {
      const loginUserId = ctx.request.user.userId;
      const TASK_STATUS_IDS = [2, 3];

      const teamUsers = await ctx.prisma.tlTeamUsers.findMany({
        select: {
          tl_team_id: true
        },
        where: {
          tl_user_id: loginUserId
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
      const jobs = await ctx.prisma.tlJobs.findMany({
        where: {
          TlServices: {
            some: {
              tl_team_id: {
                in: teamIds
              }
            }
          },
          TlTasks: {
            every: {
              tl_task_status_id: {
                in: TASK_STATUS_IDS
              }
            }
          }
        }
      });
      const collectionJobs = [];
      jobs.forEach((job) => {
        const { collection_location, td_tenant_id, collection_date } = job;
        // Because the data is not much, it is not necessary to use the hash function to optimize
        const indexCollectionJob = collectionJobs.findIndex(
          (c) =>
            c.collection_location === collection_location &&
            c.td_tenant_id === td_tenant_id &&
            // c.collection_window === collection_window &&
            c.collection_date?.getTime() === collection_date?.getTime()
        );
        if (indexCollectionJob === -1) {
          collectionJobs.push({
            collection_location,
            td_tenant_id,
            // collection_window,
            collection_date,
            jobs: [job]
          });
        } else {
          collectionJobs[indexCollectionJob]?.jobs?.push(job);
        }
      });
      return collectionJobs;
    }
  });
});
