import { schema } from 'nexus';
import { getUserId } from '../../utils';

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createListItem', {
      type: 'ListItem',
      nullable: false,
      args: {
        bookId: schema.idArg({ nullable: false }),
        ownerId: schema.idArg({ nullable: false }),
      },
      async resolve(_parent, { bookId, ownerId }, ctx) {
        const owner = await ctx.db.user.findOne({ where: { id: getUserId(ctx.token) } });
        if (!owner) {
          throw new Error('Unauthorized');
        }

        const book = await ctx.db.book.findOne({
          where: { id: bookId },
        });
        if (!book) {
          throw new Error('Book is not found');
        }

        const listItem = await ctx.db.listItem.create({
          data: {
            book: { connect: { id: bookId } },
            owner: { connect: { id: ownerId } },
          },
        });
        return listItem;
      },
    });
  },
});
