import * as React from 'react';
import { useSink } from 'redux-sink';

import { SideMenuSink } from './sidemenu-sink';

export const useSideMenu = (menuComponent: React.ComponentClass | React.FunctionComponent) => {
  React.useEffect(() => {
    const sideMenu = useSink(SideMenuSink, false);
    sideMenu.component = menuComponent;
    return () => {
      sideMenu.component = null;
    };
  }, []);
} 