import { Slider, Button } from 'antd';
import * as React from 'react';
import { useSink } from 'redux-sink';
import * as _ from 'lodash';

import { Live2DCanvas } from '@components/live2d-canvas/live2d-canvas';
import { useSideMenu } from '@sinks/sidemenu';
import { WindowSink } from '@sinks';

import { CharacterViewerSink } from './character-viewer-sink';
import { CharacterViewerSideMenu } from './character-viewer-sidemenu';
import * as styles from './character-viewer.scss';

export const CharacterViewer: React.FunctionComponent = (props) => {
  const character = useSink(CharacterViewerSink);
  const window = useSink(WindowSink);
  console.log(props);

  const components = character.live2DComponents!;
  const position = character.position!;
  const ready = components && position;

  useSideMenu(CharacterViewerSideMenu);

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
      character.position = { ...position, scale: value / 100 };
    },
    [character]
  );

  let canvasSize = 720;
  if (window.size) {
    if (window.size.minSide > 100) {
      canvasSize = window.size.minSide - 120;
    } else {
      canvasSize = 0;
    }
  }

  return (
    (ready && (
      <div className={styles.container}>
        <Button onClick={() => (character.play = !character.play)}>{character.play ? 'Pause' : 'Resume'}</Button>
        <div className={styles.canvas}>
          <Live2DCanvas
            model={components.model!}
            textures={components.textures}
            position={position}
            updaters={components.updaters}
            onClick={onCanvasClick}
            onDraw={onCanvasDraw}
            play={character.play}
            size={canvasSize}
          />
        </div>
        <Slider min={0} max={200} defaultValue={position!.scale * 100} onChange={_.debounce(onSliderChange, 50)} />
      </div>
    )) ||
    null
  );
};
