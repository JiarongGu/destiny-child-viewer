import * as React from 'react';

import { SiderHook } from '@hooks';

import { DatabaseCharacterSider } from '../database-character-sider/database-character-sider';

export const DatabaseCharacter = () => {
  SiderHook.useSider(DatabaseCharacterSider);

  return <div>Character Database</div>;
};
