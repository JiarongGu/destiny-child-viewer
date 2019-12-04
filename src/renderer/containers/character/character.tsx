import * as React from 'react';

import { CharacterSink } from './character-sink';

import * as styles from './character.module.less';
import { useSink } from 'redux-sink';
import { Live2DViewer2 } from '@components/live2d-viewer/live2d-viewer2';

export const Character: React.FunctionComponent = () => {
  const sink = useSink(CharacterSink);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    sink.loadCharacter('c429_88');
  }, []);

  const components = sink.live2DComponents!;
  const ready = components && sink.texturesLoaded;

  return (
    <div className={styles.container}>
      {ready && (
        <Live2DViewer2
          model={sink.character!}
          textures={components.textures}
          motionIdle={components.motions.idle!}
          motionAttack={components.motions.attack!}
        />
      )}
      <canvas ref={canvasRef} width={800} height={800} />
    </div>
  );
};
