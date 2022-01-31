/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryField } from 'nexus';
import { getUserCredentials } from '../../utils/auth';
import { AuthenticationError } from 'apollo-server-errors';
import pointInPolygon from 'point-in-polygon';

export const allUserDriveForTeamPreview = queryField((t) => {
  t.list.field('allUserDriveForTeamPreview', {
    type: 'TlUsers',
    resolve: async (_parent, _args, context) => {
      const credential = getUserCredentials(context);
      if (!credential) {
        throw new AuthenticationError(`No user found`);
      }
      const user = await context.prisma.tlUsers.findFirst({
        where: {
          id: credential.userId
        },
        include: {
          TlTeamUsers: true
        }
      });
      if (!user) {
        throw new AuthenticationError(`No user found for that id: ${credential.userId}`);
      }
      const team_ids = user.TlTeamUsers.map((item) => {
        return item.tl_team_id;
      });
      const users = await context.prisma.tlUsers.findMany({
        where: {
          TlTeamUsers: {
            some: {
              tl_team_id: { in: team_ids }
            }
          },
          TlTeamUserAccess: {
            some: {
              tl_role_id: 3
            }
          }
        }
      });

      let zones = await context.prisma.geofenceZones.findMany({
        where: {
          tenant_id: 1,
          active: true
        },
        orderBy: {
          name: 'asc'
        }
      });
      zones = zones.map((zone) => {
        const paths = zone.paths as any;
        if (!paths) {
          return;
        }
        const polygon = paths.map((i) => {
          return [i.lat, i.lng];
        });
        zone.paths = polygon;
        return zone;
      });
      const us = await Promise.all(
        users.map(async (user: any) => {
          const jobs = await context.prisma.tlJobs.findMany({
            where: {
              TlTasks: {
                some: {
                  tl_user_id: user.id,
                  tl_service_task_type_id: {
                    in: [1, 6]
                  }
                }
              }
            },
            include: {
              invoices: true
            }
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const latlngArr: any[] = jobs
            .map((job) => {
              if (!job.invoices.latlng) {
                return;
              }
              const latlng = job.invoices.latlng as any;
              return [latlng.lat, latlng.lng];
            })
            .filter((i) => i);
          const check = (point) => {
            for (let i = 0; i < zones.length; i++) {
              const isInZone = pointInPolygon(point, zones[i].paths);
              if (isInZone) {
                return {
                  zone: zones[i],
                  polygon: [point]
                };
              }
            }
            return false;
          };
          const latlng = Array.from(new Map(latlngArr));
          let dataZone = [];
          for (let i = 0; i < latlng.length; i++) {
            const data = check(latlng[i]);
            if (data) {
              const zone = dataZone.find((item) => {
                return item.zone.id === data.zone.id;
              });
              if (zone) {
                zone.polygon = [...zone.polygon, ...data.polygon];
              } else {
                dataZone.push(data);
              }
            }
          }
          dataZone = dataZone.map((zone) => {
            let count = 0;
            for (let i = 0; i < latlngArr.length; i++) {
              const includes = zone.polygon.some((a) => latlngArr[i].every((v, i) => v === a[i]));
              if (includes) count++;
            }
            zone.countPoint = zone.polygon.length;
            zone.countInvoice = count;
            return zone;
          });
          user.dataZone = dataZone;
          return user;
        })
      );
      return us as any;
    }
  });
});
