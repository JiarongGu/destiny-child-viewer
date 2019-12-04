import { Icon, Layout, Menu, PageHeader } from 'antd';
import * as classNames from 'classnames';
import * as React from 'react';
import { useSink } from 'redux-sink';
import { Link } from 'react-router-dom';

import { NavigationSink } from '@sinks/navigation/navigation-sink';
import { GameDataSink } from '@sinks/game-data/game-data-sink';
import { RouteContent } from '@components/route-content';

import * as styles from './app.module.less';

export const App: React.FunctionComponent = () => {
  const navigation = useSink(NavigationSink);
  const gameData = useSink(GameDataSink);

  React.useEffect(() => {
    gameData.load();
  }, []);

  const routeKeys = navigation.activeRoute && navigation.activeRoute.keys;
  const [collapsed, setCollapsed] = React.useState(true);

  return (
    <Layout className={styles.layout}>
      <Layout.Sider collapsible={true} collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)}>
        <Menu theme={'dark'} mode={'inline'} selectedKeys={routeKeys}>
          {navigation.routes.map(route => {
            const name = route.name || route.key;
            return (
              <Menu.Item key={route.key} title={name}>
                {route.link && (
                  <Link to={route.link}>
                    {route.icon && <Icon type={route.icon} />}
                    {!collapsed && name}
                  </Link>
                )}
              </Menu.Item>
            );
          })}
        </Menu>
      </Layout.Sider>

      <Layout.Content className={styles.layoutContent}>
        <RouteContent routes={navigation.routes} />
      </Layout.Content>
    </Layout>
  );
};
