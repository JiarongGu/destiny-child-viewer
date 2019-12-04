import { Select } from 'antd';
import * as React from 'react';
import { useSink } from 'redux-sink';

import { CharacterSink } from './character-sink';
import { Live2DCanvas } from '@components/live2d-canvas/live2d-canvas';
import { GameDataSink } from '@sinks/game-data/game-data-sink';

import * as styles from './character.module.less';

export const Character: React.FunctionComponent = () => {
  const character = useSink(CharacterSink);
  const gameData = useSink(GameDataSink);

  const components = character.live2DComponents!;
  const ready = components && character.texturesLoaded;

  return (
    <div className={styles.container}>
      <Select style={{ width: 120 }} onChange={(value: string) => character.loadCharacter(value)}>
        {gameData.characterIndexes.map(key => (
          <Select.Option key={key} value={key}>
            {key}
          </Select.Option>
        ))}
      </Select>
      <div>
        {ready && (
          <Live2DCanvas
            model={character.modelData!}
            textures={components.textures}
            motionDefault={components.motions.idle![0]}
            motionActive={components.motions.attack && components.motions.attack[0]}
            position={character.position!}
          />
        )}
      </div>
    </div>
  );
};
