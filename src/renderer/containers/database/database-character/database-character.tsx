import * as React from 'react';

import { useSideMenu } from '@sinks/sidemenu';

import { DatabaseCharacterSideMenu } from '../database-character-sidemenu/database-character-sidemenu';

export const DatabaseCharacter = () => {
  useSideMenu(DatabaseCharacterSideMenu);

  return <div>Character Database</div>;
};
