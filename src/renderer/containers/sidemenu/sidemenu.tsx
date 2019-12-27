import * as React from 'react';
import { Layout } from 'antd';
import { useSink } from 'redux-sink';

import * as styles from './sidemenu.module.scss';
import { SideMenuSink } from '@sinks/sidemenu';

export const SideMenu: React.FunctionComponent = () => {
  const sink = useSink(SideMenuSink);

  return (
    <Layout.Sider theme={'dark'} className={styles.container}>
      {sink.component && <sink.component />}
    </Layout.Sider>
  );
};
