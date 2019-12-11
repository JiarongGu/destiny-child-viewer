import { Slider } from 'antd';
import * as React from 'react';
import { useSink } from 'redux-sink';

import { Live2DCanvas } from '@components/live2d-canvas/live2d-canvas';
import { SideMenuSink } from '@sinks/side-menu/side-menu-sink';

import { CharacterSink } from './character-sinks/character-sink';
import { CharacterSideMenu } from './character-side-menu';
import * as styles from './character.module.less';

export const Character: React.FunctionComponent = () => {
  const characterSink = useSink(CharacterSink);

  const components = characterSink.live2DComponents!;
  const position = characterSink.position!;
  const ready = components && position;

  React.useEffect(() => {
    const sideMenu = useSink(SideMenuSink, false);
    sideMenu.component = CharacterSideMenu;
    return () => {
      sideMenu.component = null;
    };
  }, []);

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
      characterSink.position = { ...position, scale: value / 100 };
    },
    [characterSink]
  );

  return (
    (ready && (
      <div className={styles.container}>
        <Live2DCanvas
          modelData={components.data!}
          textures={components.textures}
          position={position}
          updaters={components.updaters}
          onClick={onCanvasClick}
          onDraw={onCanvasDraw}
          height={800}
          width={800}
        />
        <Slider min={0} max={200} defaultValue={position!.scale * 100} onAfterChange={onSliderChange} />
      </div>
    )) ||
    null
  );
};
