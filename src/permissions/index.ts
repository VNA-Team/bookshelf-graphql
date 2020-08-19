import { rule } from 'nexus-plugin-shield';
import { getUserId } from '../utils';

const isAuthenticated = rule({ cache: 'contextual' })((_parent, _args, ctx: { token: string | null }) => {
  const userId = getUserId(ctx.token);
  return Boolean(userId);
});

const rules = {
  Query: {
    me: isAuthenticated,
    getBooks: isAuthenticated,
    getBook: isAuthenticated,
    getListItems: isAuthenticated,
    getListItem: isAuthenticated,
  },
  Mutations: {
    createBook: isAuthenticated,
    updateBook: isAuthenticated,
    deleteBook: isAuthenticated,
    createListItem: isAuthenticated,
    updateListItem: isAuthenticated,
    deleteListItem: isAuthenticated,
  },
};

export { rules };
