import { schema } from 'nexus';

schema.objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.email();
  },
});

schema.extendType({
  type: 'User',
  definition(t) {
    t.field('listItems', {
      type: 'ListItem',
      list: true,
      args: {
        take: schema.intArg({ default: 15 }),
        skip: schema.intArg({ default: 0 }),
      },
      async resolve(user, { take, skip }, ctx) {
        return ctx.db.listItem.findMany({
          where: { ownerId: user.id },
          take: take ?? undefined,
          skip: skip ?? undefined,
        });
      },
    });
  },
});
