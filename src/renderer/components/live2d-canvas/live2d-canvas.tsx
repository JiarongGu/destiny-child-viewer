import * as React from 'react';

import { createDraw } from './live2d-canvas-renderer';
import { Position } from '@models/position';

export interface Live2DViewer2Props {
  className?: string;
  modelData: ArrayBuffer;
  updaters?: Array<L2DUpdateParam>;
  textures: Array<HTMLImageElement>;
  position: Position;
  size: number;
  play: boolean;
  onClick?: () => void;
  onDraw?: (model: Live2DModel) => void;
}

export class Live2DCanvas extends React.PureComponent<Live2DViewer2Props> {
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private requireId?: number;

  private tick?: () => void;

  public componentDidMount() {
    const canvas = this.canvasRef.current!;
    const { updaters, modelData, textures, onDraw } = this.props;
    const draw = createDraw(canvas, modelData, textures, updaters, onDraw);

    this.tick = () => {
      draw(this.props.size, this.props.position);
    };

    if (this.props.play) {
      this.startAnimation();
    }
  }

  public componentWillUnmount() {
    this.stopAnimation();
    Live2D.dispose();
  }

  public componentDidUpdate() {
    if (!this.props.play) {
      this.stopAnimation();
    }
    if (this.props.play && !this.requireId) {
      this.startAnimation();
    }
  }

  startAnimation = () => {
    if (this.tick) {
      this.tick();
      this.requireId = requestAnimationFrame(this.startAnimation);
    }
  };

  stopAnimation = () => {
    if (this.requireId) {
      cancelAnimationFrame(this.requireId);
      this.requireId = undefined;
    }
  };

  public render() {
    return (
      <canvas
        className={this.props.className}
        ref={this.canvasRef}
        onClick={this.props.onClick}
        width={this.props.size}
        height={this.props.size}
      />
    );
  }
}
