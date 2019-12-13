import { RouteModel } from '@models/route';
import { CharacterViewer } from './character-viewer/character-viewer';

export const characterRoute: RouteModel = {
  key: 'character',
  link: {
    name: 'Character',
    icon: 'user',
    url: '/character',
  },
  config: {
    path: '/character',
    component: CharacterViewer
  }
};
