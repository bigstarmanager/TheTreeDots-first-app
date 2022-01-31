import { objectType } from 'nexus';

export const PeppolScheme = objectType({
  name: 'PeppolScheme',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.code();
    t.model.description();
    t.model.country_id();
    t.model.created_by();
    t.model.created_at();
    t.model.updated_by();
    t.model.updated_at();
    t.model.active();
  }
});
