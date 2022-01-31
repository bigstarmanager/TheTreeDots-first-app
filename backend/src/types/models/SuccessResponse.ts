import { objectType } from 'nexus';

export const SuccessResponse = objectType({
  name: 'SuccessResponse',
  definition(t) {
    t.boolean('success');
  }
});
