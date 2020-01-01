import * as React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

import { RouteModel } from '@models/route';

export interface HeaderMenuProps {
  selectedKeys: Array<string>;
  className: string;
  routes: Array<RouteModel>;
}

export const HeaderNavigation: React.FunctionComponent<HeaderMenuProps> = ({ className, selectedKeys, routes }) => {
  return (
    <Layout.Header className={className}>
      <Menu theme={'light'} mode={'horizontal'} selectedKeys={selectedKeys}>
        {routes
          .filter(route => route.link)
          .map(route => (
            <Menu.Item key={route.key}>
              <Link to={route.link!.url}>{route.link!.name}</Link>
            </Menu.Item>
          ))}
      </Menu>
    </Layout.Header>
  );
};
