import * as React from 'react';
import * as _ from 'lodash';
import { useSink } from 'redux-sink';
import { RouteChildrenProps } from 'react-router';

import { useSideMenu } from '@sinks/sidemenu';
import { CharacterGroup } from '@models/character/character-group';

import { CharacterViewerSink } from './character-viewer-sink';
import { CharacterViewerSideMenu } from './character-viewer-sidemenu';
import { CharacterViewerLive2D } from './character-viewer-live2d/character-viewer-live2d';

import * as styles from './character-viewer.scss';
import { Button } from 'antd';

type RouteProps = RouteChildrenProps<{ id: string }, { character: CharacterGroup }>;

export const CharacterViewer: React.FunctionComponent = props => {
  const {
    location: { state }
  } = props as RouteProps;
  const character = state?.character || { live2ds: [] };
  const sink = useSink(CharacterViewerSink);

  React.useEffect(() => {
    if (character) {
      sink.loadCharacter(`${character.id}_${character.live2dDefault.variant}`);
    }
    return () => sink.reset();
  }, []);

  // useSideMenu(CharacterViewerSideMenu);
  return (
    <div className={styles.container}>
      <div className={styles.display}>
        <CharacterViewerLive2D canvasOffset={120} />
      </div>
      <div className={styles.selection}>
        {character.live2ds.map(live2d => (
          <div key={live2d.variant} onClick={() => sink.loadCharacter(`${character.id}_${live2d.variant}`)}>
            <img src={live2d.icon} />
          </div>
        ))}
      </div>
    </div>
  );
};
