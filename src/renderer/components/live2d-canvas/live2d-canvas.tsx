import * as React from 'react';

import { createDraw } from './live2d-canvas-renderer';
import { CharacterVariantPosition } from '@models/data/character-model';

export interface Live2DViewer2Props {
  className?: string;
  model: ArrayBuffer;
  updaters?: Array<L2DUpdateParam>;
  textures: Array<HTMLImageElement>;
  position: CharacterVariantPosition;
  size: number;
  play: boolean;
  onDraw?: (model: Live2DModel) => void;
}

export const Live2DCanvas: React.FunctionComponent<Live2DViewer2Props> = ({
  className, model, updaters, textures, position, size, play, onDraw
}) => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const tick = React.useRef<() => void>();
  const requireId = React.useRef<number>();
  const status = React.useRef<{ position: CharacterVariantPosition, size: number }>();

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
    const draw = createDraw(canvas.current!, model, textures, updaters, onDraw);
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
    <canvas className={className} ref={canvas} width={size} height={size} />
  );
}