import { objectType } from 'nexus';

export const BannerImage = objectType({
  name: 'BannerImage',
  definition(t) {
    t.model.id();
    t.model.url();
    t.model.position();
    t.model.active();
    t.model.deleted();
  }
});
