import { Icon, Layout, Menu, PageHeader } from 'antd';
import * as React from 'react';
import { useSink } from 'redux-sink';
import { Link } from 'react-router-dom';

import * as styles from './app.module.scss';

import { NavigationSink } from '@sinks/navigation/navigation-sink';
import { MetadataSink } from '@sinks/metadata/metadata-sink';
import { RouteContent } from '@components/route-content';
import { SideMenu } from '@containers/side-menu';

export const App: React.FunctionComponent = () => {
  const navigation = useSink(NavigationSink);
  const metadata = useSink(MetadataSink);

  React.useEffect(() => {
    metadata.load();
  }, []);

  const routeKeys = navigation.activeRoute && navigation.activeRoute.keys;
  const [collapsed, setCollapsed] = React.useState(true);

  return (
    <Layout className={styles.layout}>
      <Layout.Sider collapsible={true} collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)}>
        <Menu theme={'dark'} mode={'inline'} selectedKeys={routeKeys}>
          {navigation.routes
            .filter(route => route.link)
            .map(route => {
              const link = route.link!;
              const name = link.name || route.key;
              return (
                <Menu.Item key={route.key} title={name}>
                  <Link to={link.url}>
                    {link.icon && <Icon type={link.icon} />}
                    {!collapsed && name}
                  </Link>
                </Menu.Item>
              );
            })}
        </Menu>
      </Layout.Sider>

      <Layout.Content className={styles.layoutContent}>
        <div className={styles.layoutRouteContent}>
          <RouteContent routes={navigation.routes} />
        </div>
        <SideMenu />
      </Layout.Content>
    </Layout>
  );
};
