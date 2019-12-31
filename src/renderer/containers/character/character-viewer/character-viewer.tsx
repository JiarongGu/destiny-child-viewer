import * as React from 'react';
import * as _ from 'lodash';
import { useSink } from 'redux-sink';
import { RouteChildrenProps } from 'react-router';

import { CharacterViewerSink } from './character-viewer-sink';
import { CharacterViewerLive2D } from './character-viewer-live2d/character-viewer-live2d';
import { CharacterViewerSideMenu } from './character-viewer-sidemenu/character-viewer-sidemenu';

import * as styles from './character-viewer.scss';
import { useSideMenu } from '@sinks/sidemenu';

export const CharacterViewer: React.FunctionComponent = props => {
  const { match } = props as RouteChildrenProps<{ characterId: string; variantId: string }>;
  const characterViewSink = useSink(CharacterViewerSink);

  React.useEffect(() => {
    if (match?.params) {
      characterViewSink.loadCharacter(match.params.characterId, match.params.variantId);
    }
    return () => characterViewSink.reset();
  }, []);

  useSideMenu(CharacterViewerSideMenu);

  return (
    <div className={styles.container}>
      <CharacterViewerLive2D />
    </div>
  );
};
