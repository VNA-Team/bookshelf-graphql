import { schema } from 'nexus';
import { getUserId } from '../../utils';

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteListItem', {
      type: 'ListItem',
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
          throw new Error('List item not found');
        }

        const deletedListItem = await ctx.db.listItem.delete({ where: { id } });
        return deletedListItem;
      },
    });
  },
});
