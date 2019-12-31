import * as React from 'react';
import { Layout } from 'antd';
import { useSink } from 'redux-sink';

import * as styles from './sidemenu.module.scss';
import { SideMenuSink } from '@sinks/sidemenu';

export const SideMenu: React.FunctionComponent = () => {
  const sideMenuSink = useSink(SideMenuSink);
  return (
    (sideMenuSink.component && (
      <aside className={styles.container}>
        <sideMenuSink.component />
      </aside>
    )) ||
    null
  );
};
