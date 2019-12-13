import { Layout, PageHeader } from 'antd';
import * as React from 'react';
import { useSink } from 'redux-sink';

import * as styles from './app.module.scss';

import { NavigationSink } from '@sinks';
import { RouteContent } from '@components/route-content';
import { SideMenu } from '@containers/side-menu';
import { AppMenu } from './app-menu/app-menu';

export const App: React.FunctionComponent = () => {
  const navigation = useSink(NavigationSink, sink => [ sink.routes ]);

  return (
    <Layout className={styles.layout}>
      <AppMenu />

      <Layout.Content className={styles.layoutContent}>
        <div className={styles.layoutRouteContent}>
          <RouteContent routes={navigation.routes} />
        </div>
        <SideMenu />
      </Layout.Content>
    </Layout>
  );
};
