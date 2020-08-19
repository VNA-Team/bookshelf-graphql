import { schema } from 'nexus';

schema.objectType({
  name: 'Book',
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.author();
    t.model.coverImageUrl();
    t.model.pageCount();
    t.model.publisher();
    t.model.synopsis();
  },
});

schema.extendType({
  type: 'Book',
  definition(t) {
    t.field('listItems', {
      type: 'ListItem',
      list: true,
      args: {
        take: schema.intArg({ default: 15 }),
        skip: schema.intArg({ default: 0 }),
      },
      async resolve(book, { take, skip }, ctx) {
        return ctx.db.listItem.findMany({
          where: { bookId: book.id },
          take: take ?? undefined,
          skip: skip ?? undefined,
        });
      },
    });
  },
});
