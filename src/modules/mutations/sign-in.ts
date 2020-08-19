import { schema } from 'nexus';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { config } from '../../config';

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signIn', {
      type: 'AuthResponse',
      nullable: false,
      args: {
        email: schema.stringArg({ nullable: false }),
        password: schema.stringArg({ nullable: false }),
      },
      async resolve(_parent, { email, password }, ctx) {
        const sanitizedEmail = email.toLowerCase();
        const user = await ctx.db.user.findOne({ where: { email: sanitizedEmail } }).catch(() => {
          throw new Error('Wrong email or password');
        });

        if (!user) {
          throw new Error('Wrong email or password');
        }

        const isPasswordMatch = await compare(password, user.password);
        if (!isPasswordMatch) {
          throw new Error('Wrong email or password');
        }

        const token = sign({ userId: user.id }, config.APP_SECRET);
        return { token, user };
      },
    });
  },
});
