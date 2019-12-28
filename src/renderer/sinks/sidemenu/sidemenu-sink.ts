import { sink, state } from 'redux-sink';

@sink('side-menu')
export class SideMenuSink {
  @state component: React.ComponentClass | React.FunctionComponent | null = null;
}
