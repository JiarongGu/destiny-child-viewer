import * as React from 'react';
import { Button, Slider } from 'antd';
import { useSink } from 'redux-sink';
import * as _ from 'lodash';

import * as styles from './character-viewer-live2d.scss';
import { CharacterViewerSink } from '../character-viewer-sink';
import { WindowSink } from '@sinks';
import { Live2DCanvas } from '@components';
import { useLiv2dCanvas } from './use-live2d-canvas';
import { getLive2dCanvasSize } from './get-live2d-canvas-size';

export interface CharacterViewerLive2D {
  canvasOffset: number;
}

interface DragPosition {
  x: number;
  y: number;
}

function convertPosition(value: number, base: number) {
  const scale = value / base;
  return scale;
}

export const CharacterViewerLive2D: React.FunctionComponent<CharacterViewerLive2D> = ({ canvasOffset }) => {
  const characterView = useSink(CharacterViewerSink, sink => [sink.live2DComponents!, sink.position!]);
  const window = useSink(WindowSink);

  const components = characterView.live2DComponents!;
  const position = characterView.position!;
  const canvasSize = getLive2dCanvasSize(window.size, canvasOffset);

  const { onCanvasDraw, onCanvasClick } = useLiv2dCanvas(components);
  const onSliderChange = React.useCallback(value => (characterView.position = { ...position, scale: value / 100 }), [
    position
  ]);

  const dragPosition = React.useRef<DragPosition>();

  if (!components || !position) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.canvas}
        onClick={onCanvasClick}
        onMouseDown={event => (dragPosition.current = { x: event.clientX, y: event.clientY })}
        onMouseUp={() => (dragPosition.current = undefined)}
        onMouseMove={event => {
          if (dragPosition.current) {
            const x = event.clientX - dragPosition.current.x;
            const y = event.clientY - dragPosition.current.y;

            characterView.position = { 
              x: position.x + convertPosition(x, canvasSize),
              y: position.y + convertPosition(y, -canvasSize),
              scale: position.scale 
            }

            dragPosition.current = {
              x: event.clientX, y: event.clientY
            }
          }
        }}
      >
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
      <Slider min={0} max={200} defaultValue={position!.scale * 100} onChange={_.debounce(onSliderChange, 50)} />
    </div>
  );
};
