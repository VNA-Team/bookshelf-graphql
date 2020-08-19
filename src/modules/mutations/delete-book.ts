import { schema } from 'nexus';
import { getUserId } from '../../utils';

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteBook', {
      type: 'Book',
      nullable: false,
      args: {
        id: schema.idArg({ nullable: false }),
      },
      async resolve(_parent, { id }, ctx) {
        const user = await ctx.db.user.findOne({ where: { id: getUserId(ctx.token) } });
        if (!user) {
          throw new Error('Unauthorized');
        }

        await ctx.db.listItem.deleteMany({ where: { bookId: id } });
        const deletedBook = await ctx.db.book.delete({ where: { id } });
        return deletedBook;
      },
    });
  },
});
