import * as React from 'react';

import { Live2DViewer } from '../../components';

import * as styles from './character.module.less';

export const Character: React.FunctionComponent = () => (
  <div className={styles.container}>
    <Live2DViewer />
  </div>
);
