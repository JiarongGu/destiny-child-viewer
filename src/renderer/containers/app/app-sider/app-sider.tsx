import * as React from 'react';
import { useSink } from 'redux-sink';
import { Layout } from 'antd';

import { SiderSink } from '@sinks';
import * as styles from './app-sider.scss';

export const AppSider: React.FunctionComponent = () => {
  const siderSink = useSink(SiderSink);
  const { config, collapsed } = siderSink;

  return (
    (config && (
      <Layout.Sider
        className={styles.container}
        collapsed={collapsed}
        collapsible={config.collapsible}
        onCollapse={() => {
          siderSink.collapsed = !collapsed;
        }}
        width={config.width}
      >
        <config.component />
      </Layout.Sider>
    )) ||
    null
  );
};
