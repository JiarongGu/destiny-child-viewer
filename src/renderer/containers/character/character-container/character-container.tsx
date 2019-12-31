import * as React from 'react';
import { useSink } from 'redux-sink';
import { Layout } from 'antd';

import { HeaderMenu, RouteContent } from '@components';
import { NavigationSink } from '@sinks';
import { characterRoute } from '../character-route';

import * as styles from './character-container.scss';

export const CharacterContainer: React.FunctionComponent = () => {
  const layout = useSink(NavigationSink);
  const routes = characterRoute.routes!;

  return (
    <Layout>
      <HeaderMenu routes={routes} className={styles.header} selectedKeys={layout.activeRoute.keys} />
      <Layout.Content className={styles.content}>
        <RouteContent routes={routes} />
      </Layout.Content>
    </Layout>
  );
};
