import { schema } from 'nexus';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { config } from '../../config';

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signUp', {
      type: 'AuthResponse',
      nullable: false,
      args: {
        email: schema.stringArg({ nullable: false }),
        password: schema.stringArg({ nullable: false }),
      },
      async resolve(_parent, { email, password }, ctx) {
        const existingUserCount = await ctx.db.user
          .count({ where: { OR: [{ email: {equals: email,mode: 'insensitive' } }] } })
          .catch(() => {
            throw new Error('Something bad happened');
          });

        if (existingUserCount > 0) {
          throw new Error('User with same email or username exists');
        }

        const hashedPassword = await hash(password, 12).catch(() => {
          throw new Error('Something bad happened');
        });
        const newUser = await ctx.db.user
          .create({ data: { email, password: hashedPassword } })
          .catch(() => {
            throw new Error('Something bad happened');
          });

        const token = sign({ userId: newUser.id }, config.APP_SECRET);
        return { token, user: newUser };
      },
    });
  },
});
