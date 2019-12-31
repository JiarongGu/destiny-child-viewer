import * as React from 'react';
import { useSink } from 'redux-sink';
import * as _ from 'lodash';

import { Live2DCanvas } from '@components';
import { useDragPosition, useResizeObserver } from '@hooks';

import { CharacterViewerSink } from '../character-viewer-sink';
import * as styles from './character-viewer-live2d.scss';

export const CharacterViewerLive2D: React.FunctionComponent = () => {
  const characterView = useSink(CharacterViewerSink, sink => [sink.live2DComponents!, sink.position!]);
  const components = characterView.live2DComponents!;
  const position = characterView.position!;

  const [canvasSize, setCanvasSize] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const onCanvasDraw = React.useCallback(() => {
    const idleMotion = components && components.motions.idle![0];
    if (idleMotion && components.motionManager.isFinished()) {
      components.motionManager.startMotion(idleMotion);
    }
  }, [components]);

  const onCanvasClick = React.useCallback(() => {
    if (components.motions.attack) {
      components.motionManager.startMotion(components.motions.attack[0]);
    }
  }, [components]);

  const onWheel = React.useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (position) {
        const value = event.deltaY / 5000;
        const scale = position?.scale + value;
        characterView.position = { ...position, scale };
      }
    },
    [position]
  );

  useResizeObserver(
    containerRef,
    event => {
      const size = event.height > event.width ? event.width : event.height;
      setCanvasSize(size);
    },
    []
  );

  const mouseProps = useDragPosition(
    event => {
      const convertPosition = (value: number, base: number) => value / base;
      const positionBase = canvasSize / 1.5;

      characterView.position = {
        x: position.x + convertPosition(event.x, positionBase),
        y: position.y - convertPosition(event.y, positionBase),
        scale: position.scale
      };
    },
    [position, canvasSize]
  );

  const ready = components && position;

  return (
    <div ref={containerRef} className={styles.container}>
      {ready && (
        <div className={styles.canvas} onClick={onCanvasClick} onWheel={onWheel} {...mouseProps}>
          <Live2DCanvas
            model={components.model!}
            textures={components.textures}
            updaters={components.updaters}
            onDraw={onCanvasDraw}
            play={characterView.play}
            size={canvasSize}
            x={position.x}
            y={position.y}
            scale={position.scale}
          />
        </div>
      )}
    </div>
  );
};
