import * as React from 'react';
import { useSink } from 'redux-sink';
import * as _ from 'lodash';
import classnames from 'classnames';

import { Live2DCanvas } from '@components';
import { useDragPosition, useResizeObserver } from '@hooks';

import { CharacterViewerSink } from '../character-viewer-sink';
import * as styles from './character-viewer-live2d.scss';

export interface CharacterViewerLive2DProps {
  className?: string
}

export const CharacterViewerLive2D: React.FunctionComponent<CharacterViewerLive2DProps> = ({ className }) => {
  const characterView = useSink(CharacterViewerSink, sink => [sink.components!, sink.position!, sink.play]);

  const { components, position, play } = characterView;

  const [canvasSize, setCanvasSize] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const onCanvasDraw = React.useCallback(() => {
    if (components) {
      const idleMotion = components.motions.idle![0];
      if (idleMotion && components.motionManager.isFinished()) {
        components.motionManager.startMotion(idleMotion);
      }
    }
  }, [components]);

  const onCanvasClick = React.useCallback(() => {
    if (components && components.motions.attack) {
      components.motionManager.startMotion(components.motions.attack[0]);
    }
  }, [components]);

  const onWheel = React.useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (position) {
        const value = event.deltaY / 2500;
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
      if(canvasSize !== size) {
        setCanvasSize(size);
      }
    },
    []
  );

  const mouseProps = useDragPosition(
    event => {
      const convertPosition = (value: number, base: number) => value / base;
      const positionBase = canvasSize / 1.5;
      if (position) {
        characterView.position = {
          x: position.x + convertPosition(event.x, positionBase),
          y: position.y - convertPosition(event.y, positionBase),
          scale: position.scale
        };
      }
    },
    [position, canvasSize]
  );

  return (
    <div ref={containerRef} className={classnames(styles.container, className)}>
      {components && position && (
        <div className={styles.canvas} onClick={onCanvasClick} onWheel={onWheel} {...mouseProps}>
          <Live2DCanvas
            model={components.model!}
            textures={components.textures}
            updaters={components.updaters}
            onDraw={onCanvasDraw}
            play={play}
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
