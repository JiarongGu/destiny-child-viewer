import { sink, state } from 'redux-sink';

export type SideMenuInnerComponent = React.ComponentClass | React.FunctionComponent | null;

@sink('side-menu')
export class SideMenuSink {
  @state component: SideMenuInnerComponent = null;
}
