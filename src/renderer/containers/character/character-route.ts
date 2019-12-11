import { RouteModel } from '@models/navigation/route-model';
import { Character } from './character';

export const characterRoute: RouteModel = {
  key: 'character',
  name: 'Character',
  icon: 'user',
  link: '/character',
  props: {
    path: '/character',
    component: Character
  }
};
