import * as React from 'react';
import { Layout } from 'antd';
import { useSink } from 'redux-sink';

import * as styles from './side-menu.module.less';
import { SideMenuSink } from '@sinks/side-menu/side-menu-sink';

export const SideMenu: React.FunctionComponent = () => {
  const sink = useSink(SideMenuSink);

  return (
    <Layout.Sider theme={'dark'} width={300} className={styles.container}>
      {sink.component && <sink.component />}
    </Layout.Sider>
  );
};
