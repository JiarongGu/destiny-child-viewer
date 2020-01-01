import { Layout } from 'antd';
import * as React from 'react';
import { useSink } from 'redux-sink';

import * as styles from './app.scss';

import { NavigationSink } from '@sinks';
import { RouteContent } from '@components/route-content';

import { AppNavigation } from './app-navigation/app-navigation';
import { AppSider } from './app-sider/app-sider';

export const App: React.FunctionComponent = () => {
  const navigation = useSink(NavigationSink, sink => [sink.routes]);

  return (
    <Layout className={styles.layout}>
      <AppNavigation />
      <Layout>
        <Layout.Content>
          <RouteContent routes={navigation.routes} />
        </Layout.Content>
        <AppSider />
      </Layout>
    </Layout>
  );
};
