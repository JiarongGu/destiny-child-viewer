import { RouteModel } from '@models/route';
import { DatabaseContainer } from './database-container/database-container';

import { DatabaseCharacter } from './database-character/database-character';

export const databaseRoute: RouteModel = {
  key: 'database',
  link: {
    name: 'Database',
    icon: 'database',
    url: '/database',
  },
  config: {
    path: '/database',
    component: DatabaseContainer
  },
  routes: [{
    key: 'database.character',
    link: {
      name: 'Character',
      url: '/database/character',
    },
    config: {
      path: '/database/character',
      component: DatabaseCharacter
    }
  }]
};
