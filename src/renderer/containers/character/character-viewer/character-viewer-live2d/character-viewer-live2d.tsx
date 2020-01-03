import * as React from 'react';
import { useSink } from 'redux-sink';
import * as _ from 'lodash';
import classnames from 'classnames';

import { Live2DCanvas } from '@components';
import { useDragPosition, useResizeObserver } from '@hooks';

import { CharacterViewerSink } from '../character-viewer-sink';
import * as styles from './character-viewer-live2d.scss';
import { Live2DHelper } from '@utils';
import { Spin } from 'antd';

export interface CharacterViewerLive2DProps {
  className?: string;
}

export const CharacterViewerLive2D: React.FunctionComponent<CharacterViewerLive2DProps> = ({ className }) => {
  const characterView = useSink(CharacterViewerSink, sink => [
    sink.components, sink.position, sink.play, sink.loading
  ]);

  const { components, position, play, loading } = characterView;
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
    if (components) {
      const motionKeys = Object.keys(components.motions).filter(motion => 
        !motion.startsWith('idle') && !motion.startsWith('banner')
      );
      const randomMotion = motionKeys && motionKeys[Math.round(Math.random() * motionKeys.length - 1)];
      if (randomMotion) {
        components.motionManager.startMotion(components.motions[randomMotion][0]);
      }
    }
  }, [components]);

  const onWheel = React.useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (position) {
        const value = event.deltaY / 2000;
        const scale = Live2DHelper.round(position?.scale + value);
        characterView.position = { ...position, scale };
      }
    },
    [position]
  );

  useResizeObserver(
    containerRef,
    event => {
      const size = event.height > event.width ? event.width : event.height;
      if (canvasSize !== size) {
        setCanvasSize(size);
      }
    },
    []
  );

  const { onMouseDown, onMouseMove, onMouseUp, moving } = useDragPosition(
    event => {
      const convertPosition = (value: number, base: number) => value / base;
      const positionBase = canvasSize / 2;
      if (position) {
        characterView.position = {
          x: Live2DHelper.round(position.x + convertPosition(event.x, positionBase)),
          y: Live2DHelper.round(position.y - convertPosition(event.y, positionBase)),
          scale: position.scale
        };
      }
    },
    event => event.preventDefault(),
    [position, canvasSize]
  );

  return (
    <div ref={containerRef} className={classnames(styles.container, className)}>
      {loading && <Spin spinning={true} /> }
      {components && position && !loading && (
        <div
          className={classnames(styles.canvas, { [styles.canvasMoving]: moving })}
          onClick={onCanvasClick}
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
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
