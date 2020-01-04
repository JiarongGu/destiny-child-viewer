import * as React from 'react';

import { createDraw } from './live2d-canvas-renderer';

interface Live2DViewport {
  x: number;
  y: number;
  scale: number;
  size: number;
}

export interface Live2DViewer2Props extends Live2DViewport {
  className?: string;
  model: ArrayBuffer;
  updaters?: Array<L2DUpdateParam>;
  textures: Array<HTMLImageElement>;
  play: boolean;
  onDraw?: (model: Live2DModel) => void;
  onClick?: React.MouseEventHandler<HTMLCanvasElement>;
}

export const Live2DCanvas: React.FunctionComponent<Live2DViewer2Props> = props => {
  const { className, x, y, scale, size, onClick } = props;
  const { model, updaters, textures, play, onDraw } = props;

  const canvas = React.useRef<HTMLCanvasElement>(null);
  const tick = React.useRef<() => void>();
  const requireId = React.useRef<number>();
  const viewportState = React.useRef<Live2DViewport>();

  const startAnimation = React.useCallback(() => {
    if (tick.current) {
      tick.current();
      requireId.current = requestAnimationFrame(startAnimation);
    }
  }, []);

  const stopAnimation = React.useCallback(() => {
    if (requireId.current) {
      cancelAnimationFrame(requireId.current);
      requireId.current = undefined;
    }
  }, []);

  React.useEffect(() => {
    viewportState.current = { size, x, y, scale };
  }, [size, x, y, scale]);

  React.useEffect(() => {
    const draw = createDraw(canvas.current!, model, textures, updaters, onDraw);
    tick.current = () => {
      if (viewportState.current) {
        const state = viewportState.current;
        draw(state.size, state.size, state.x, state.y, state.scale);
      }
    };
    if (play) {
      startAnimation();
    }
    return () => {
      stopAnimation();
      Live2D.dispose();
    };
  }, [model, textures, updaters, onDraw]);

  React.useEffect(() => {
    if (!play) {
      stopAnimation();
    }
    if (play && !requireId.current) {
      startAnimation();
    }
  }, [play]);

  return <canvas className={className} ref={canvas} width={size} height={size} onClick={onClick} />;
};
