import { CharacterIcon } from './character-icon/character-icon';
import { RouteModel } from '@models/route';

import { CharacterContainer } from './character-container/character-container';
import { CharacterViewer } from './character-viewer/character-viewer';

export const characterRoute: RouteModel = {
  key: 'character',
  link: {
    name: 'Character',
    icon: 'user',
    url: '/character/icon',
  },
  config: {
    path: '/character',
    component: CharacterContainer
  },
  routes: [
    {
      link: {
        name: 'Overview',
        url: '/character/icon'
      },
      key: 'character.overview',
      config: {
        path: '/character/icon',
        component: CharacterIcon
      }
    },
    {
      link: {
        name: 'Live2D',
        url: '/character/view'
      },
      key: 'character.view',
      config: {
        path: '/character/view',
        component: CharacterViewer
      }
    }]
};
