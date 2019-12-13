import { RouteModel } from '@models/route';
import { Database } from './database';

export const databaseRoute: RouteModel = {
  key: 'database',
  link: {
    name: 'Database',
    icon: 'database',
    url: '/database',
  },
  config: {
    path: '/database',
    component: Database
  }
};
