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
  const characterView = useSink(CharacterViewerSink);

  React.useEffect(() => {
    if (character.live2dDefault) {
      characterView.loadCharacter(`${character.id}_${character.live2dDefault.variant}`);
    }
    return () => characterView.reset();
  }, []);

  // useSideMenu(CharacterViewerSideMenu);
  return (
    <div className={styles.container}>
      <div className={styles.display}>
        <CharacterViewerLive2D canvasOffset={100} />
      </div>
      <div className={styles.selection}>
        <Button onClick={() => (characterView.play = !characterView.play)}>
          {characterView.play ? 'Pause' : 'Resume'}
        </Button>
        {character.live2ds.map(live2d => {
          const id = `${character.id}_${live2d.variant}`;
          return (
            <div key={live2d.variant}>
              <img
                src={live2d.icon}
                alt={id}
                className={styles.selectionButton}
                onClick={() => characterView.loadCharacter(id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
