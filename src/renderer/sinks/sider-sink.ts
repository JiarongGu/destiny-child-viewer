import { sink, state, effect } from 'redux-sink';
import { CollapseType } from 'antd/lib/layout/Sider';

export type SiderComponent = React.ComponentClass | React.FunctionComponent;

export interface SiderConfiguration {
  component: SiderComponent;
  width?: number | string;
}

@sink('sider')
export class SiderSink {
  @state config?: SiderConfiguration;

  @state collapsed: boolean = false;
  @state collapsible: boolean = false;
  @state onCollapse?: (collapsed: boolean, type: CollapseType) => void;

  @effect
  public clearCollapse() {
    if (this.collapsible) {
      this.collapsible = false;
      this.collapsed = false;
    }

    if (this.onCollapse) {
      this.collapsed = false;
    }
  }

  @effect
  public clearSider() {
    if (this.config) {
      this.config = undefined;
    }
  }
}
