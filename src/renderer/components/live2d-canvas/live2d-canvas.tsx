import * as React from 'react';

import { drawCanvas, getTexture, getRendererContext } from './live2d-canvas-renderer';
import { Position } from '@models/position';

export interface Live2DViewer2Props {
  model: ArrayBuffer;
  textures: Array<HTMLImageElement>;
  motion: Live2DMotion;
  motionManager: L2DMotionManager;
  className?: string;
  position: Position;
  onClick?: () => void;
}

export class Live2DCanvas extends React.Component<Live2DViewer2Props> {
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private requireId?: number;
  private close: boolean = false;

  public componentDidMount() {
    const canvas = this.canvasRef.current!;
    const context = getRendererContext(canvas)!;

    Live2D.init();
    Live2D.setGL(context);

    const model = Live2DModelWebGL.loadModel(this.props.model);
    const { motion, motionManager } = this.props;

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
        drawCanvas(context, model, motionManager, motion, this.props.position);
        this.requireId = requestAnimationFrame(tick);
      }
    };
    tick();
  }

  public componentWillUnmount() {
    Live2D.dispose();
    this.close = true;
  }

  public render() {
    return (
      <canvas
        className={this.props.className}
        ref={this.canvasRef}
        onClick={this.props.onClick}
        width={800}
        height={800}
      />
    );
  }
}
