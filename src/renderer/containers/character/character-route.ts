import { CharacterIcon } from './character-icon/character-icon';
import { RouteModel } from '@models/route';

import { CharacterContainer } from './character-container/character-container';
import { CharacterViewer } from './character-viewer';

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
      key: 'character.overview',
      link: {
        name: 'Overview',
        url: '/character/icon'
      },
      config: {
        exact: true,
        path: '/character/icon',
        component: CharacterIcon
      }
    },
    {
      key: 'character.view',
      config: {
        strict: true,
        path: '/character/view/:characterId/:variantId',
        component: CharacterViewer
      }
    },
    {
      key: 'character.view',
      link: {
        name: 'Live2D',
        url: '/character/view'
      },
      config: {
        exact: true,
        path: '/character/view',
        component: CharacterViewer
      }
    }]
};
