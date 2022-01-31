import { objectType } from 'nexus';

export const Menu = objectType({
  name: 'Menu',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.label();
    t.model.icon();
    t.model.to();
    t.model.description();
    t.model.menu_id();
    t.model.active();
  }
});
