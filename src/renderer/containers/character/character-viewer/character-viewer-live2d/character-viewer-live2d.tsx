import * as React from 'react';
import { Button, Slider } from 'antd';
import { useSink } from 'redux-sink';
import * as _ from 'lodash';

import * as styles from './character-viewer-live2d.scss';
import { CharacterViewerSink } from '../character-viewer-sink';
import { WindowSink } from '@sinks';
import { Live2DCanvas } from '@components';

export interface CharacterViewerLive2D {
  canvasOffset: number;
}

export const CharacterViewerLive2D: React.FunctionComponent<CharacterViewerLive2D> = ({
  canvasOffset
}) => {
  const characterView = useSink(CharacterViewerSink);
  const window = useSink(WindowSink);

  const components = characterView.live2DComponents!;
  const position = characterView.position!;
  const ready = components && position;

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
    [characterView]
  );

  let canvasSize = 720;
  if (window.size) {
    if (window.size.minSide > canvasOffset) {
      canvasSize = window.size.minSide - canvasOffset;
    } else {
      canvasSize = 0;
    }
  }

  if (!ready) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Button onClick={() => (characterView.play = !characterView.play)}>
        {characterView.play ? 'Pause' : 'Resume'}
      </Button>
      <div className={styles.canvas}>
        <Live2DCanvas
          model={components.model!}
          textures={components.textures}
          position={position}
          updaters={components.updaters}
          onClick={onCanvasClick}
          onDraw={onCanvasDraw}
          play={characterView.play}
          size={canvasSize}
        />
      </div>
      <Slider min={0} max={200} defaultValue={position!.scale * 100} onChange={_.debounce(onSliderChange, 50)} />
    </div>
  );
};
