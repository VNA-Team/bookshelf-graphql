import { schema } from 'nexus';
import { getUserId } from '../../utils';

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateListItem', {
      type: 'ListItem',
      nullable: false,
      args: {
        id: schema.idArg({ nullable: false }),
        rating: schema.intArg({ nullable: true }),
        notes: schema.stringArg({ nullable: true }),
        finishDate: schema.stringArg({ nullable: true }),
      },
      async resolve(_parent, { id, rating, notes, finishDate }, ctx) {
        const owner = await ctx.db.user.findOne({ where: { id: getUserId(ctx.token) } });
        if (!owner) {
          throw new Error('Unauthorized');
        }

        const listItem = await ctx.db.listItem.findOne({ where: { id } });
        if (!listItem || listItem.ownerId !== owner.id) {
          throw new Error('List item not found');
        }

        const updatedListItem = await ctx.db.listItem.update({
          data: {
            rating,
            notes,
            finishDate,
          },
          where: { id },
        });
        return updatedListItem;
      },
    });
  },
});
