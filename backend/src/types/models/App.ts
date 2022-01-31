import { objectType } from 'nexus';

export const AppTermConditions = objectType({
  name: 'AppTermConditions',
  definition(t) {
    t.model.id();
    t.model.term_condition();
    t.model.created_at();
    t.model.updated_at();
    t.model.active();
  }
});

export const Version = objectType({
  name: 'Version',
  definition(t) {
    t.model.id();
    t.model.version();
    t.model.android();
    t.model.ios();
    t.model.web();
  }
});
