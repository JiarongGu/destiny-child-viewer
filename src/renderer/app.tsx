import * as React from 'react';
import * as classNames from 'classnames';
import { Icon, Layout, Menu, PageHeader } from 'antd';

import { useSink } from 'redux-sink';
import { NavigationSink } from '@services/navigation/navigation-sink';
import { RouteContent } from '@components/route-content';
import { Link } from 'react-router-dom';

import * as styles from './app.module.less';

export const App: React.FunctionComponent = () => {
  const navigation = useSink(NavigationSink);
  const routeKeys = navigation.activeRoute && navigation.activeRoute.keys;
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Layout className={styles.layout}>
      <Layout.Sider
        collapsible={true}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
      >
        <Menu theme={'dark'} mode={'inline'} selectedKeys={routeKeys}>
          {navigation.routes.map(route => (
            <Menu.Item key={route.key} title={route.name}>
              <Link to={'/character'}>Character</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Layout.Sider>

      <Layout.Content>
        <RouteContent routes={navigation.routes} />
      </Layout.Content>
    </Layout>
  );
};
