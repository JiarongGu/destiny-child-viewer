import * as React from 'react';
import { useSink } from 'redux-sink';
import { Spin } from 'antd';
import * as _ from 'lodash';
import classnames from 'classnames';

import { Live2DCanvas, AudioPlayer } from '@components';
import { useDragPosition, useResizeObserver } from '@hooks';
import { Live2DHelper, VariantPosition } from '@shared';

import { CharacterViewerSink } from '../character-viewer-sink';
import { CharacterViewerActionSink } from '../character-viewer-action-sink';
import { CharacterViewerPositionSink } from '../character-viewer-position-sink';

import * as styles from './character-viewer-live2d.scss';
import { usePositionUpdater } from './use-position-updater';

export interface CharacterViewerLive2DProps {
  className?: string;
}

export const CharacterViewerLive2D: React.FunctionComponent<CharacterViewerLive2DProps> = ({ className }) => {
  const canvasScale = 2;

  const characterView = useSink(CharacterViewerSink, sink => [sink.components, sink.loading, sink.current]);
  const characterAction = useSink(CharacterViewerActionSink);
  const characterPosition = useSink(CharacterViewerPositionSink, sink => [sink.position]);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const { components, loading, current } = characterView;
  const { volume, voice, play } = characterAction;

  React.useEffect(() => {
    if (current) {
      characterPosition.loadPosition(current.characterId, current.variantId);
    }
    return () => {
      characterPosition.reset();
      characterAction.reset();
    };
  }, [current]);

  const onCanvasDraw = React.useCallback(() => {
    if (components) {
      const idleMotion = components.motions.idle![0];
      if (idleMotion && components.motionManager.isFinished()) {
        components.motionManager.startMotion(idleMotion);
      }
    }
  }, [components]);

  const { position, moving, canvasSize, ...handlers  } = usePositionUpdater(characterPosition, containerRef);

  const onClick = React.useCallback(() => characterAction.playRandomMotion(), []);

  return (
    <div ref={containerRef} className={classnames(styles.container, className)}>
      {loading && <Spin spinning={true} />}
      {!loading && position && components && (
        <div
          className={classnames(styles.canvas, { [styles.canvasMoving]: moving })}
          {...handlers}
        >
          <Live2DCanvas
            model={components.model!}
            textures={components.textures}
            updaters={components.updaters}
            onDraw={onCanvasDraw}
            play={play}
            x={position.x}
            y={position.y}
            size={canvasSize * canvasScale}
            scale={position.scale / canvasScale}
            onClick={onClick}
          />
        </div>
      )}
      <AudioPlayer play={!!voice} src={voice?.url} volume={volume} />
    </div>
  );
};
