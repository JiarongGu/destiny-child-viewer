import * as React from 'react';
import { useSink } from 'redux-sink';

import { SiderSink, SiderComponent } from '@sinks';

export class SiderHook {
  public static useSiderCollapse(
    onCollapse?: (context: SiderSink) => void,
    onCreate?: (context: SiderSink) => void
  ) {
    React.useEffect(() => {
      const sider = useSink(SiderSink, false);
      sider.collapsed = true;

      if (onCollapse) {
        sider.onCollapse = () => {
          sider.collapsed = !sider.collapsed;
          onCollapse(sider);
        };
      }
      if (onCreate) {
        onCreate(sider);
      }
      return () => sider.clearCollapse();
    }, []);
  }

  public static useSider(component: SiderComponent) {
    React.useEffect(() => {
      const sider = useSink(SiderSink, false);
      sider.component = component;
      return () => sider.clearSider();
    }, []);
  }
}