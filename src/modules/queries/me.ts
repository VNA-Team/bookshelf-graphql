import { schema } from 'nexus';
import { getUserId } from '../../utils';

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: false,
      async resolve(_parent, _args, ctx) {
        const user = await ctx.db.user.findOne({ where: { id: getUserId(ctx.token) } });
        if (!user) {
          throw new Error('Unauthorized');
        }

        return user;
      },
    });
  },
});
