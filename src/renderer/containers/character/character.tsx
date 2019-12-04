import { Select } from 'antd';
import * as React from 'react';
import { useSink } from 'redux-sink';

import { CharacterSink } from './character-sink';
import { Live2DCanvas } from '@components/live2d-canvas/live2d-canvas';
import { GameDataSink } from '@sinks/game-data/game-data-sink';

import * as styles from './character.module.less';

export const Character: React.FunctionComponent = () => {
  const characterSink = useSink(CharacterSink);
  const gameData = useSink(GameDataSink);

  const components = characterSink.live2DComponents!;
  const ready = components && characterSink.texturesLoaded;

  const motionManager = new L2DMotionManager();

  return (
    <div className={styles.container}>
      <Select style={{ width: 120 }} onChange={(value: string) => characterSink.loadCharacter(value)}>
        {gameData.characterIndexes.map(key => (
          <Select.Option key={key} value={key}>
            {key}
          </Select.Option>
        ))}
      </Select>
      <div>
        {ready && (
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
        )}
      </div>
    </div>
  );
};
