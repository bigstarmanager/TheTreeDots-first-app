import { objectType } from 'nexus';

export const DashboardAnnouncement = objectType({
  name: 'DashboardAnnouncement',
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.content();
    t.model.created_by();
    t.model.created_at();
    t.model.updated_by();
    t.model.updated_at();
    t.model.active();
  }
});
