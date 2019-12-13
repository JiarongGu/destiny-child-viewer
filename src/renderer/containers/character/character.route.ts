import { RouteModel } from '@models/route';
import { Character } from './character';

export const characterRoute: RouteModel = {
  key: 'character',
  link: {
    name: 'Character',
    icon: 'user',
    url: '/character',
  },
  config: {
    path: '/character',
    component: Character
  }
};
