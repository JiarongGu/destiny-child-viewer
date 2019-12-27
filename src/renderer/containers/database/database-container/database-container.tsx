import * as React from 'react';
import { Layout } from 'antd';
import { useSink } from 'redux-sink';

import { RouteContent } from '@components/route-content';
import { NavigationSink } from '@sinks';
import { DatabaseHeaderMenu } from '../database-headermenu/database-headermenu';
import { databaseRoute } from '../database-route';

import * as styles from './database-container.scss';

export const DatabaseContainer = () => {
  const layout = useSink(NavigationSink);

  return (
    <Layout>
      <DatabaseHeaderMenu className={styles.header} selectedKeys={layout.activeRoute.keys} />
      <Layout.Content>
        <div className={styles.content}>
          <RouteContent routes={databaseRoute.routes!} />
        </div>
      </Layout.Content>
    </Layout>
  );
};
