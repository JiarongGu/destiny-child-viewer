import { Select } from 'antd';
import * as React from 'react';
import { useSink } from 'redux-sink';

import { MetadataSink } from '@sinks/metadata/metadata-sink';
import { CharacterSink } from '../character-sinks/character-sink';
import { CharacterModifySink } from '../character-sinks/character-modify-sink';

export const CharacterSideMenu = () => {
  const metadata = useSink(MetadataSink);
  const characterSink = useSink(CharacterSink, false);
  const characterModifySink = useSink(CharacterModifySink, false);

  const loadCharacter = React.useCallback((value: string) => {
    characterSink.loadCharacter(value);
  }, []);

  return (
    <Select defaultValue={characterModifySink.id} style={{ width: 120 }} onChange={loadCharacter}>
      {metadata.characterIndexes.map(key => (
        <Select.Option key={key} value={key}>
          {key}
        </Select.Option>
      ))}
    </Select>
  );
};
