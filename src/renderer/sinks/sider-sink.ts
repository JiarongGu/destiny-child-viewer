import { sink, state, effect } from 'redux-sink';

export type SiderComponent = React.ComponentClass | React.FunctionComponent;

export interface SiderConfiguration {
  component: SiderComponent;
  width?: number | string;
  collapsible?: boolean;
}

@sink('sider')
export class SiderSink {
  @state config?: SiderConfiguration;
  @state collapsed: boolean = false;

  @effect
  public clearSider() {
    this.config = undefined;
    this.collapsed = false;
  }
}
