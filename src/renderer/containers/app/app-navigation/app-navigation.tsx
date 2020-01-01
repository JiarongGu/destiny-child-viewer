import * as React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { useSink } from 'redux-sink';
import { Link } from 'react-router-dom';

import { NavigationSink } from '@sinks';

export const AppNavigation: React.FunctionComponent = () => {
  const navigation = useSink(NavigationSink);
  const routeKeys = navigation.activeRoute && navigation.activeRoute.keys;
  const [collapsed, setCollapsed] = React.useState(true);

  return (
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
  );
};
