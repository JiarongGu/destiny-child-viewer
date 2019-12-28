import { Select } from 'antd';
import * as React from 'react';
import { useSink } from 'redux-sink';

import { MetadataSink } from '@sinks/metadata/metadata-sink';
import { CharacterViewerSink } from './character-viewer-sink';
import { CharacterModifySink } from '../character-sinks/character-modify-sink';

export const CharacterViewerSideMenu = () => {
  const metadata = useSink(MetadataSink);
  const characterViewerSink = useSink(CharacterViewerSink);
  const characterModifySink = useSink(CharacterModifySink, false);

  const loadCharacter = React.useCallback((value: string) => {
    characterViewerSink.loadCharacter(value);
  }, []);

  return (
    <div>
      <Select defaultValue={characterModifySink.id} style={{ width: 120 }} onChange={loadCharacter}>
        {metadata.characterIndexes.map(key => (
          <Select.Option key={key} value={key}>
            {key}
          </Select.Option>
        ))}
      </Select>
      <img src={characterViewerSink.icon} />
    </div>
  );
};
