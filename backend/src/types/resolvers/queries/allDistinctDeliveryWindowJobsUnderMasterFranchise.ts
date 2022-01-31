import { intArg, queryField } from 'nexus';
import { queryJobMasterFranchiseType } from '../../utils/constant';
import { getDistinctJobMasterFranchiseWhere } from '../../utils/commonFunction';

export const allDistinctDeliveryWindowJobsUnderMasterFranchise = queryField((t) => {
  t.list.string('allDistinctDeliveryWindowJobsUnderMasterFranchise', {
    args: {
      userId: intArg(),
      type: queryJobMasterFranchiseType
    },
    resolve: async (_parent, { userId, type }, context) => {
      // get team id
      const teamId = await context.prisma.tlTeamUsers.findMany({
        where: {
          tl_user_id: userId
        }
      });
      const teamType = await context.prisma.tlTeamRelation.findMany({
        where: {
          tl_team_id: teamId[0].tl_team_id
        }
      });
      const where = getDistinctJobMasterFranchiseWhere(teamId[0].tl_team_id, type);
      // Check MasterFranchise
      let isMasterFranchise = false;
      for (let index = 0; index < teamType.length; index++) {
        if (teamType[index].parent_team_id === null) {
          isMasterFranchise = true;
          break;
        }
      }
      if (!isMasterFranchise) return [];
      const jobs = await context.prisma.tlJobs.findMany({
        select: {
          delivery_time_from: true,
          delivery_time_to: true
        },
        where,
        distinct: ['delivery_time_from', 'delivery_time_to']
      });
      return jobs.map((job) =>
        job.delivery_time_from.toString().concat(' to ', job.delivery_time_to.toString())
      );
    }
  });
});
