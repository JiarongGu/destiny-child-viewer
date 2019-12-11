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

export const Live2DCanvas: React.FunctionComponent<Live2DViewer2Props> = ({
  className, modelData, updaters, textures, position, size, play, onClick, onDraw
}) => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const tick = React.useRef<() => void>();
  const requireId = React.useRef<number>();
  const status = React.useRef<{ position: Position, size: number }>();

  const startAnimation = React.useCallback(() => {
    if (tick.current) {
      tick.current();
      requireId.current = requestAnimationFrame(startAnimation);
    }
  }, [])

  const stopAnimation = React.useCallback(() => {
    if (requireId.current) {
      cancelAnimationFrame(requireId.current);
      requireId.current = undefined;
    }
  }, []);

  React.useEffect(() => {
    status.current = { size, position };
  }, [size, position])

  React.useEffect(() => {
    const draw = createDraw(canvas.current!, modelData, textures, updaters, onDraw);
    tick.current = () => {
      if (status.current) {
        draw(status.current.size, status.current.position);
      }
    };
    if (play) {
      startAnimation();
    }
    return () => {
      stopAnimation();
      Live2D.dispose();
    }
  }, []);

  React.useEffect(() => {
    if (!play) {
      stopAnimation();
    }
    if (play && !requireId.current) {
      startAnimation();
    }
  },[ play ])

  return (
    <canvas className={className} ref={canvas} onClick={onClick} width={size} height={size} />
  );
}