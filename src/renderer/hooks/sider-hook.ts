import * as React from 'react';
import { useSink } from 'redux-sink';

import { SiderSink, SiderComponent } from '@sinks';

export class SiderHook {
  public static useSider(
    component: SiderComponent,
    config?: { width?: number | string, collapsible?: boolean, defaultCollapse?: boolean }
  ) {
    React.useEffect(() => {
      const sider = useSink(SiderSink, false);
      const { width, collapsible, defaultCollapse } = config || {};

      sider.config = { component, width, collapsible };

      if (defaultCollapse) {
        sider.collapsed = true;
      }

      return () => sider.clearSider();
    }, []);
  }
}