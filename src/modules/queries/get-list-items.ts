import { schema } from 'nexus';
import { getUserId } from '../../utils';

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('getListItems', {
      type: 'ListItem',
      list: true,
      args: {
        take: schema.intArg({ default: 15 }),
        skip: schema.intArg({ default: 0 }),
      },
      async resolve(_parent, { take, skip }, ctx) {
        const owner = await ctx.db.user.findOne({ where: { id: getUserId(ctx.token) } });
        if (!owner) {
          throw new Error('Unauthorized');
        }

        const listItems = await ctx.db.listItem.findMany({
          where: { ownerId: owner.id },
          take: take ?? undefined,
          skip: skip ?? undefined,
        });
        return listItems;
      },
    });
  },
});
