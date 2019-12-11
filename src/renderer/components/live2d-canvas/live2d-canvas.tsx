import * as React from 'react';

import { createDraw } from './live2d-canvas-renderer';
import { Position } from '@models/position';

export interface Live2DViewer2Props {
  className?: string;
  modelData: ArrayBuffer;
  updaters?: Array<L2DUpdateParam>;
  textures: Array<HTMLImageElement>;
  position: Position;
  height: number;
  width: number;
  onClick?: () => void;
  onDraw?: (model: Live2DModel) => void;
}

export class Live2DCanvas extends React.Component<Live2DViewer2Props> {
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private requireId?: number;

  public componentDidMount() {
    const canvas = this.canvasRef.current!;
    const { updaters, modelData, textures, onDraw } = this.props;
    const draw = createDraw(canvas, modelData, textures, updaters, onDraw);
    const tick = () => {
      draw(this.props.position);
      this.requireId = requestAnimationFrame(tick);
    };
    tick();
  }

  public componentWillUnmount() {
    Live2D.dispose();
    if (this.requireId) {
      cancelAnimationFrame(this.requireId);
    }
  }

  public render() {
    const { height, width } = this.props;
    return (
      <canvas
        className={this.props.className}
        ref={this.canvasRef}
        onClick={this.props.onClick}
        width={width}
        height={height}
      />
    );
  }
}
