import { schema } from 'nexus';
import { getUserId } from '../../utils';

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateBook', {
      type: 'Book',
      nullable: false,
      args: {
        id: schema.idArg({ nullable: false }),
        title: schema.stringArg({ nullable: true }),
        author: schema.stringArg({ nullable: true }),
        coverImageUrl: schema.stringArg({ nullable: true }),
        pageCount: schema.intArg({ nullable: true }),
        publisher: schema.stringArg({ nullable: true }),
        synopsis: schema.stringArg({ nullable: true }),
      },
      async resolve(_parent, { id, ...data }, ctx) {
        const user = await ctx.db.user.findOne({ where: { id: getUserId(ctx.token) } });
        if (!user) {
          throw new Error('Unauthorized');
        }

        const book = await ctx.db.book.update({
          where: { id },
          data: {
            author: data.author ?? undefined,
            title: data.title ?? undefined,
            coverImageUrl: data.coverImageUrl ?? undefined,
            pageCount: data.pageCount ?? undefined,
            publisher: data.publisher ?? undefined,
            synopsis: data.synopsis ?? undefined,
          },
        });
        return book;
      },
    });
  },
});
