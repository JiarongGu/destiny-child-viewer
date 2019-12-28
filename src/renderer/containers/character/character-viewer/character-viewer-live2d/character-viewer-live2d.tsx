import * as React from 'react';
import { Slider } from 'antd';
import { useSink } from 'redux-sink';
import * as _ from 'lodash';

import * as styles from './character-viewer-live2d.scss';
import { CharacterViewerSink } from '../character-viewer-sink';
import { WindowSink } from '@sinks';
import { Live2DCanvas } from '@components';
import { getLive2dCanvasSize } from './get-live2d-canvas-size';
import { useDragPosition } from './use-drag-position';

export interface CharacterViewerLive2D {
  canvasOffset: number;
}

export const CharacterViewerLive2D: React.FunctionComponent<CharacterViewerLive2D> = ({ canvasOffset }) => {
  const characterView = useSink(CharacterViewerSink, sink => [sink.live2DComponents!, sink.position!]);
  const window = useSink(WindowSink);

  const components = characterView.live2DComponents!;
  const position = characterView.position!;
  const canvasSize = getLive2dCanvasSize(window.size, canvasOffset);

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
  
  const onSliderChange = React.useCallback(
    value => {
      characterView.position = { ...position, scale: value / 100 };
    },
    [position]
  );

  const mouseProps = useDragPosition(
    event => {
      const convertPosition = (value: number, base: number) => value / base;
      const positionBase = (canvasSize - canvasOffset) / 1.5;

      characterView.position = {
        x: position.x + convertPosition(event.x, positionBase),
        y: position.y - convertPosition(event.y, positionBase),
        scale: position.scale
      };
    },
    [position]
  );

  if (!components || !position) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.canvas} onClick={onCanvasClick} {...mouseProps}>
        <Live2DCanvas
          model={components.model!}
          textures={components.textures}
          position={position}
          updaters={components.updaters}
          onDraw={onCanvasDraw}
          play={characterView.play}
          size={canvasSize}
        />
      </div>
      <Slider min={0} max={300} defaultValue={position!.scale * 100} onChange={_.debounce(onSliderChange, 50)} />
    </div>
  );
};
