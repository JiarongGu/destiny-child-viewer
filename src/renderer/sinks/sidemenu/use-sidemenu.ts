import * as React from 'react';
import { useSink } from 'redux-sink';

import { SideMenuSink, SideMenuInnerComponent } from './sidemenu-sink';

export const useSideMenu = (menuComponent: SideMenuInnerComponent) => {
  React.useEffect(() => {
    const sideMenu = useSink(SideMenuSink, false);
    sideMenu.component = menuComponent;
    return () => {
      sideMenu.component = null;
    };
  }, []);
} 