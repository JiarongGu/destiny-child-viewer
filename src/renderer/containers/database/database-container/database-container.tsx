import * as React from 'react';
import { Layout } from 'antd';
import { useSink } from 'redux-sink';

import { RouteContent, HeaderMenu } from '@components';
import { NavigationSink } from '@sinks';
import { databaseRoute } from '../database-route';

import * as styles from './database-container.scss';

export const DatabaseContainer = () => {
  const layout = useSink(NavigationSink);
  const routes = databaseRoute.routes!;

  return (
    <Layout>
      <HeaderMenu routes={routes} className={styles.header} selectedKeys={layout.activeRoute.keys} />
      <Layout.Content>
        <div className={styles.content}>
          <RouteContent routes={routes} />
        </div>
      </Layout.Content>
    </Layout>
  );
};
