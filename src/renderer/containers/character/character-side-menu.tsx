import { Select } from 'antd';
import * as React from 'react';
import { useSink } from 'redux-sink';

import { GameDataSink } from '@sinks/game-data/game-data-sink';
import { CharacterSink } from './character-sinks/character-sink';
import { CharacterModifySink } from './character-sinks/character-modify-sink';

export const CharacterSideMenu = () => {
  const gameData = useSink(GameDataSink, false);
  const characterModifySink = useSink(CharacterModifySink, false);
  const characterSink = useSink(CharacterSink, false);

  const loadCharacter = React.useCallback((value: string) => {
    characterSink.loadCharacter(value);
  }, []);

  return (
    <Select defaultValue={characterModifySink.id} style={{ width: 120 }} onChange={loadCharacter}>
      {gameData.characterIndexes.map(key => (
        <Select.Option key={key} value={key}>
          {key}
        </Select.Option>
      ))}
    </Select>
  );
};
