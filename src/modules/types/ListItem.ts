import { schema } from 'nexus';

schema.objectType({
  name: 'ListItem',
  definition(t) {
    t.model.id();
    t.model.book();
    t.model.owner();
    t.model.finishDate();
    t.model.startDate();
    t.model.notes();
    t.model.rating();
  },
});
