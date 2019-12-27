import * as React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { databaseRoute } from '../database-route';

export interface DatabaseHeaderMenuProps {
  selectedKeys: Array<string>;
  className: string;
}

export const DatabaseHeaderMenu: React.FunctionComponent<DatabaseHeaderMenuProps> = ({ className, selectedKeys }) => {
  return (
    <Layout.Header className={className}>
      <Menu theme={'light'} mode={'horizontal'} selectedKeys={selectedKeys}>
        {databaseRoute.routes!.map(route => (
          <Menu.Item key={route.key}>{route.link && <Link to={route.link.url}>{route.link.name}</Link>}</Menu.Item>
        ))}
      </Menu>
    </Layout.Header>
  );
};
