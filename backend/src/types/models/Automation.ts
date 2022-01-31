import { objectType } from 'nexus';

export const JobSchedule = objectType({
  name: 'JobSchedule',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.every();
    t.model.start_hour();
    t.model.start_minute();
    t.model.next_running_at();
    t.model.forever();
  }
});
