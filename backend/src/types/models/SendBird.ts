import { objectType } from 'nexus';

export const CustomerConnectedGroupChannels = objectType({
  name: 'CustomerConnectedGroupChat',
  definition(t) {
    t.list.field('channels', { type: 'JSON' });
    t.string('ts');
    t.string('next');
  }
});
