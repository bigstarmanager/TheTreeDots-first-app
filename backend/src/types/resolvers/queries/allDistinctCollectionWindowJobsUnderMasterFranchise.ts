import { intArg, queryField } from 'nexus';
import { queryJobMasterFranchiseType } from '../../utils/constant';
import { getDistinctJobMasterFranchiseWhere } from '../../utils/commonFunction';

export const allDistinctCollectionWindowJobsUnderMasterFranchise = queryField((t) => {
  t.list.string('allDistinctCollectionWindowJobsUnderMasterFranchise', {
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
          collection_time_from: true,
          collection_time_to: true
        },
        where,
        distinct: ['collection_time_from', 'collection_time_to']
      });
      return jobs.map((job) =>
        job.collection_time_from.toString().concat(' to ', job.collection_time_to.toString())
      );
    }
  });
});
