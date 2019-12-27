import { sink, state } from 'redux-sink';

@sink('sideMenu')
export class SideMenuSink {
  @state component: React.ComponentClass | React.FunctionComponent | null = null;
}
