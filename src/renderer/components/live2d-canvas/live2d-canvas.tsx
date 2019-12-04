import * as React from 'react';

import { drawCanvas, getTexture, getRendererContext } from './live2d-canvas-renderer';
import { Position } from '@models/character/position';

export interface Live2DViewer2Props {
  model: ArrayBuffer;
  textures: Array<HTMLImageElement>;
  motionDefault: Live2DMotion;
  motionActive?: Live2DMotion;
  className?: string;
  position: { scale: number; x: number; y: number };
}

export class Live2DCanvas extends React.Component<Live2DViewer2Props> {
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private motionManager = new L2DMotionManager();
  private requireId?: number;
  private close: boolean = false;

  public componentDidMount() {
    const canvas = this.canvasRef.current!;
    const context = getRendererContext(canvas)!;

    Live2D.init();
    Live2D.setGL(context);

    const model = Live2DModelWebGL.loadModel(this.props.model);
    const motionDefault = this.props.motionDefault;
    const motionManager = this.motionManager;
    const { position } = this.props;

    // initialize texture
    this.props.textures.forEach((texture, index) => {
      const webTexture = getTexture(context, texture, model);
      if (webTexture) {
        model.setTexture(index, webTexture);
      }
    });
    model.setGL(context);

    const tick = () => {
      if (!this.close) {
        drawCanvas(context, model, motionManager, motionDefault, position);
        this.requireId = requestAnimationFrame(tick);
      }
    };
    tick();
  }

  public componentWillUnmount() {
    Live2D.dispose();
    this.close = true;
  }

  private playActiveMotion = () => {
    if (this.props.motionActive && this.motionManager) {
      this.motionManager.startMotion(this.props.motionActive);
    }
  };

  public render() {
    return (
      <canvas
        className={this.props.className}
        ref={this.canvasRef}
        onClick={this.playActiveMotion}
        width={800}
        height={800}
      />
    );
  }
}
