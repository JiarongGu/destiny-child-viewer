import * as React from 'react';
import * as _ from 'lodash';
import { useSink } from 'redux-sink';
import { RouteChildrenProps } from 'react-router';

import { useSideMenu } from '@sinks/sidemenu';

import { CharacterViewerSink } from './character-viewer-sink';
import { CharacterViewerSideMenu } from './character-viewer-sidemenu';
import { CharacterViewerLive2D } from './character-viewer-live2d/character-viewer-live2d';

import * as styles from './character-viewer.scss';
import { Button } from 'antd';
import { CharacterMetadata } from '@models/character/character-metadata';
import { PathService } from '@services';

type RouteProps = RouteChildrenProps<{ id: string }, { character: CharacterMetadata; defaultVariant: string }>;

export const CharacterViewer: React.FunctionComponent = props => {
  const {
    location: { state }
  } = props as RouteProps;
  const character = state?.character || { variants: [], render: {} };
  const defaultVariant = state?.defaultVariant;
  const characterView = useSink(CharacterViewerSink);

  React.useEffect(() => {
    const renderModel = character.render[defaultVariant];
    if (renderModel) {
      characterView.loadCharacter(character.id, defaultVariant);
    }
    return () => characterView.reset();
  }, []);

  const getAssetPath = React.useCallback(path => {
    const pathService = new PathService();
    return pathService.getAssetPath(path);
  }, []);

  const variants = character.variants.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  // useSideMenu(CharacterViewerSideMenu);
  return (
    <div className={styles.container}>
      <div className={styles.display}>
        <CharacterViewerLive2D />
      </div>
      <div className={styles.selection}>
        <Button onClick={() => (characterView.play = !characterView.play)}>
          {characterView.play ? 'Pause' : 'Resume'}
        </Button>
        {variants.map(variant => (
          <div key={variant}>
            <img
              src={getAssetPath(character.icon[variant].home)}
              alt={variant}
              className={styles.selectionButton}
              onClick={() => characterView.loadCharacter(character.id, variant)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
