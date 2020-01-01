import { sink, state, effect } from 'redux-sink';
import { CollapseType } from 'antd/lib/layout/Sider';

export type SiderComponent = React.ComponentClass | React.FunctionComponent;

@sink('sider')
export class SiderSink {
  @state component?: SiderComponent;
  @state width?: number | string;

  @state collapsed: boolean = false;
  @state collapsible: boolean = false;
  @state onCollapse?: (collapsed: boolean, type: CollapseType) => void;

  @effect
  public clearSider() {
    if (this.collapsible) {
      this.collapsible = false;
      this.collapsed = false;
    }

    if (this.onCollapse) {
      this.collapsed = false;
    }
  }

  @effect
  public clearCollapse() {
    if (this.component) {
      this.component = undefined;
    }

    if (this.width) {
      this.width = undefined;
    }
  }
}
