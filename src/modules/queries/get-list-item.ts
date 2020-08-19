import { schema } from 'nexus';
import { getUserId } from '../../utils';

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('getListItem', {
      type: 'ListItem',
      nullable: true,
      args: {
        id: schema.idArg({ nullable: false }),
      },
      async resolve(_parent, { id }, ctx) {
        const owner = await ctx.db.user.findOne({ where: { id: getUserId(ctx.token) } });
        if (!owner) {
          throw new Error('Unauthorized');
        }

        const listItem = await ctx.db.listItem.findOne({
          where: { id },
          include: { owner: true },
        });
        if (listItem?.owner.id !== owner.id) {
          return null;
        }

        return listItem;
      },
    });
  },
});
