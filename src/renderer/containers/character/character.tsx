import { Slider } from 'antd';
import * as React from 'react';
import { useSink } from 'redux-sink';

import { Live2DCanvas } from '@components/live2d-canvas/live2d-canvas';

import { CharacterSink } from './character-sinks/character-sink';
import { SideMenuSink } from '@sinks/side-menu/side-menu-sink';

import * as styles from './character.module.less';
import { CharacterSideMenu } from './character-side-menu';

export const Character: React.FunctionComponent = () => {
  const characterSink = useSink(CharacterSink);
  const components = characterSink.live2DComponents!;
  const ready = components && characterSink.texturesLoaded;
  const [motionManager] = React.useState(new L2DMotionManager());

  React.useEffect(() => {
    const sideMenu = useSink(SideMenuSink, false);
    sideMenu.component = CharacterSideMenu;
    return () => {
      sideMenu.component = null;
    };
  }, []);

  return (
    <div className={styles.container}>
      {ready && (
        <>
          <Slider
            min={0}
            max={200}
            defaultValue={characterSink.position!.scale * 100}
            onAfterChange={(value: any) => {
              if (characterSink.position) {
                characterSink.position = { ...characterSink.position, scale: value / 100 };
              }
            }}
          />
          <Live2DCanvas
            model={characterSink.modelData!}
            textures={components.textures}
            motion={components.motions.idle![0]}
            motionManager={motionManager}
            position={characterSink.position!}
            onClick={() => {
              if (components.motions.attack) {
                motionManager.startMotion(components.motions.attack[0]);
              }
            }}
          />
        </>
      )}
    </div>
  );
};
