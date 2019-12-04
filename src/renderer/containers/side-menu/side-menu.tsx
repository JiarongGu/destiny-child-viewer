import * as React from 'react';

import * as styles from './side-menu.module.less';
import { Layout } from 'antd';

export const SideMenu: React.FunctionComponent = () => {
  return (
    <Layout.Sider theme={'dark'} width={300} className={styles.container}>
      <h1>Side Menu</h1>
    </Layout.Sider>
  );
};
