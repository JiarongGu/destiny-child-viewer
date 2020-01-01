import * as React from 'react';
import { useSink } from 'redux-sink';
import { Layout } from 'antd';

import { SiderSink } from '@sinks';
import * as styles from './app-sider.scss';

export const AppSider: React.FunctionComponent = () => {
  const siderSink = useSink(SiderSink);
  const { width, collapsed, collapsible, onCollapse } = siderSink;
  
  return (
    (siderSink.component && (
      <Layout.Sider
        className={styles.container}
        collapsed={collapsed}
        collapsible={collapsible}
        onCollapse={onCollapse}
        width={width}
      >
        <siderSink.component />
      </Layout.Sider>
    )) ||
    null
  );
};
