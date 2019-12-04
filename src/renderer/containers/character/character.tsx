import * as React from 'react';

import { CharacterSink } from './character-sink';

import * as styles from './character.module.less';
import { useSink } from 'redux-sink';
import { Live2DCanvas } from '@components/live2d-canvas/live2d-canvas';
import { Select } from 'antd';

export const Character: React.FunctionComponent = () => {
  const sink = useSink(CharacterSink);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    sink.loadCharacter('c420_89');
  }, []);

  const components = sink.live2DComponents!;
  const ready = components && sink.texturesLoaded;

  return (
    <div className={styles.container}>
      <Select defaultValue={'c420_89'} style={{ width: 120 }} onChange={(value: string) => sink.loadCharacter(value)}>
        <Select.Option value={'c420_89'}>c420_89</Select.Option>
        <Select.Option value={'c429_88'}>c429_88</Select.Option>
      </Select>
      <div>
        {ready && (
          <Live2DCanvas
            model={sink.modelData!}
            textures={components.textures}
            motionDefault={components.motions.idle![0]}
            motionActive={components.motions.attack![0]}
          />
        )}
      </div>
    </div>
  );
};
