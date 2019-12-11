import { RouteModel } from '@models/navigation/route-model';
import { Database } from './database';

export const databaseRoute: RouteModel = {
  key: 'database',
  name: 'Database',
  icon: 'database',
  link: '/database',
  props: {
    path: '/database',
    component: Database
  }
};
