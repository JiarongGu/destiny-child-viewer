import * as React from 'react';

import { drawContext, getWebGLContext, Live2DDrawState, playMotion } from './web-gl-utils';

export interface Live2DViewer2Props {
  model: ArrayBuffer;
  textures: Array<HTMLImageElement>;
  motionAttack?: Live2DMotion;
  motionIdle: Live2DMotion;
}

export class Live2DViewer2 extends React.Component<Live2DViewer2Props> {
  private viewRef = React.createRef<HTMLCanvasElement>();
  private motionManager = new L2DMotionManager();
  private requestID?: number;

  public componentDidMount() {
    const view = this.viewRef.current;
    if (!view) return;

    Live2D.init();
    const context = getWebGLContext(view);
    const state = {
      initLive2DCompleted: false,
      loadLive2DCompleted: true,
      stopLive2D: false,
      textureLoadedCount: 0
    };

    if (!context) {
      console.error('Failed to create WebGl context!');
      return;
    }

    Live2D.setGL(context);
    const model = Live2DModelWebGL.loadModel(this.props.model);
    const textures = this.props.textures;
    const motionIdle = this.props.motionIdle;
    const motionManager = this.motionManager;

    (function tick() {
      drawContext(context, motionManager, model, textures, motionIdle, state);

      if (view) {
        requestAnimationFrame(tick);
      }
    })();
  }

  public render() {
    return (
      <div>
        <h1>Live 2D</h1>
        <canvas
          ref={this.viewRef}
          onClick={() => {
            if (this.props.motionAttack) {
              playMotion(this.motionManager, this.props.motionAttack);
            }
          }}
          width="800"
          height="800"
        />
      </div>
    );
  }
}
