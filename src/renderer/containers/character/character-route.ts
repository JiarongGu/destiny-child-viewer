import { RouteModel } from '@models/route';

import { CharacterContainer } from './character-container/character-container';
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
    component: CharacterContainer
  },
  routes: [{
    key: 'character.view',
    config: {
      path: '/character/{id}/view',
      component: CharacterViewer
    }
  }]
};
