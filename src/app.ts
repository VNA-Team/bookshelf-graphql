import { use, settings } from 'nexus';
import { prisma } from 'nexus-plugin-prisma';
import { auth } from 'nexus-plugin-jwt-auth';
import { shield } from 'nexus-plugin-shield';
import { config } from './config';
import { rules } from './permissions';

settings.change({ server: { graphql: { introspection: true }, playground: true } });

use(prisma({ features: { crud: true } }));

use(
  auth({
    appSecret: config.APP_SECRET,
  }),
);

// Enables the Shield plugin
use(
  shield({
    rules,
  }),
);
