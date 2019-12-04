import * as React from 'react';

import { CharacterSink } from './character-sink';

import * as styles from './character.module.less';
import { useSink } from 'redux-sink';
import { Live2DCanvas } from '@components/live2d-canvas/live2d-canvas';

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
      {ready && (
        <Live2DCanvas
          model={sink.modelData!}
          textures={components.textures}
          motionDefault={components.motions.idle![0]}
          motionActive={components.motions.attack![0]}
        />
      )}
      <canvas ref={canvasRef} width={800} height={800} />
    </div>
  );
};
