import * as React from 'react';
import { useSink } from 'redux-sink';

import { SiderSink, SiderComponent } from '@sinks';

export class SiderHook {
  public static useSiderCollapse(
    onCollapse?: (context: SiderSink) => void
  ) {
    React.useEffect(() => {
      const sider = useSink(SiderSink, false);
      sider.collapsible = true;

      if (onCollapse) {
        sider.onCollapse = () => {
          sider.collapsed = !sider.collapsed;
          onCollapse(sider);
        };
      }
      return () => sider.clearCollapse();
    }, []);
  }

  public static useSider(component: SiderComponent, width?: number | string) {
    React.useEffect(() => {
      const sider = useSink(SiderSink, false);
      sider.config = { component, width };
      return () => sider.clearSider();
    }, []);
  }
}