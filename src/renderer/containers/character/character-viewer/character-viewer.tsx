import { Slider, Button } from 'antd';
import * as React from 'react';
import { useSink } from 'redux-sink';

import { Live2DCanvas } from '@components/live2d-canvas/live2d-canvas';
import { WindowSink } from '@sinks/window/window-sink';
import { useSideMenu } from '@sinks/sidemenu';

import { CharacterSink } from '../character-sinks/character-sink';
import { CharacterSideMenu } from '../character-viewer-sidemenu/character-sidemenu';
import * as styles from './character-viewer.scss';

export const CharacterViewer: React.FunctionComponent = () => {
  const character = useSink(CharacterSink);
  const window = useSink(WindowSink);

  const components = character.live2DComponents!;
  const position = character.position!;
  const ready = components && position;

  useSideMenu(CharacterSideMenu);

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

  const onSliderChange = React.useCallback(value => {
    character.position = { ...position, scale: value / 100 };
  },[character]);

  let canvasSize = 720;
  if (window.size) {
    if (window.size.minSide > 100) {
      canvasSize = window.size.minSide - 100;
    } else {
      canvasSize = 0;
    }
  }

  return (
    (ready && (
      <div className={styles.container}>
        <Button onClick={() => (character.animation = !character.animation)}>
          {character.animation ? 'Pause' : 'Resume'}
        </Button>
        <div className={styles.canvas}>
          <Live2DCanvas
            modelData={components.data!}
            textures={components.textures}
            position={position}
            updaters={components.updaters}
            onClick={onCanvasClick}
            onDraw={onCanvasDraw}
            play={character.animation}
            size={canvasSize}
          />
        </div>
        <Slider min={0} max={200} defaultValue={position!.scale * 100} onChange={onSliderChange} />
      </div>
    )) ||
    null
  );
};
