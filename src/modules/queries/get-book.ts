import { schema } from 'nexus';
import { getUserId } from '../../utils';

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('getBook', {
      type: 'Book',
      nullable: true,
      args: {
        id: schema.idArg({ nullable: false }),
      },
      async resolve(_parent, { id }, ctx) {
        const user = await ctx.db.user.findOne({ where: { id: getUserId(ctx.token) } });
        if (!user) {
          throw new Error('Unauthorized');
        }

        const book = await ctx.db.book.findOne({ where: { id } });
        return book;
      },
    });
  },
});
