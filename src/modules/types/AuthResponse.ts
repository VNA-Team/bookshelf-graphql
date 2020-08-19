import { schema } from 'nexus';

schema.objectType({
  name: 'AuthResponse',
  definition(t) {
    t.string('token', { nullable: false });
    t.field('user', { type: 'User', nullable: false });
  },
});
