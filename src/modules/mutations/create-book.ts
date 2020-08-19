import { schema } from 'nexus';
import { getUserId } from '../../utils';

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createBook', {
      type: 'Book',
      nullable: false,
      args: {
        title: schema.stringArg({ nullable: false }),
        author: schema.stringArg({ nullable: false }),
        coverImageUrl: schema.stringArg({ nullable: false }),
        pageCount: schema.intArg({ nullable: false }),
        publisher: schema.stringArg({ nullable: false }),
        synopsis: schema.stringArg({ nullable: false }),
      },
      async resolve(_parent, args, ctx) {
        const user = await ctx.db.user.findOne({ where: { id: getUserId(ctx.token) } });
        if (!user) {
          throw new Error('Unauthorized');
        }

        const book = await ctx.db.book.create({
          data: args,
        });
        return book;
      },
    });
  },
});
