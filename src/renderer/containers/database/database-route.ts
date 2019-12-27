import { RouteModel } from '@models/route';
import { DatabaseContainer } from './database-container/database-container';

import { DatabaseCharacter } from './database-character/database-character';

const characterUrl = '/database/character';

export const databaseRoute: RouteModel = {
  key: 'database',
  link: {
    name: 'Database',
    icon: 'database',
    url: characterUrl,
  },
  config: {
    path: '/database',
    component: DatabaseContainer
  },
  routes: [{
    key: 'database.character',
    link: {
      name: 'Character',
      url: characterUrl,
    },
    config: {
      path: characterUrl,
      component: DatabaseCharacter
    }
  }]
};
