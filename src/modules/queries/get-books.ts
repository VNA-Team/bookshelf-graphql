import { schema } from 'nexus';
import { FindManyBookArgs } from '@prisma/client';
import { getUserId } from '../../utils';

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('getBooks', {
      type: 'Book',
      list: true,
      args: {
        take: schema.intArg({ default: 15 }),
        skip: schema.intArg({ default: 0 }),
        query: schema.stringArg({ nullable: true }),
      },
      async resolve(_parent, { take, skip, query }, ctx) {
        const user = await ctx.db.user.findOne({ where: { id: getUserId(ctx.token) } });
        if (!user) {
          throw new Error('Unauthorized');
        }

        let builtOptions: FindManyBookArgs = { take: take ?? undefined, skip: skip ?? undefined };
        if (query) {
          builtOptions = {
            ...builtOptions,
            where: {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { author: { contains: query, mode: 'insensitive' } },
                { publisher: { contains: query, mode: 'insensitive' } },
                { synopsis: { contains: query, mode: 'insensitive' } },
              ],
            },
          };
        }

        const books = await ctx.db.book.findMany(builtOptions);
        return books;
      },
    });
  },
});
