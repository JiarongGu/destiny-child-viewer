import * as React from 'react';
import * as _ from 'lodash';
import { useSink } from 'redux-sink';
import { RouteChildrenProps } from 'react-router';

import { SiderHook } from '@hooks';

import { CharacterViewerSink } from './character-viewer-sink';
import { CharacterViewerLive2D } from './character-viewer-live2d/character-viewer-live2d';
import { CharacterViewerSider } from './character-viewer-sider/character-viewer-sider';

import * as styles from './character-viewer.scss';

export const CharacterViewer: React.FunctionComponent = props => {
  const { match } = props as RouteChildrenProps<{ characterId: string; variantId: string }>;
  const characterViewSink = useSink(CharacterViewerSink);

  React.useEffect(() => {
    if (match?.params) {
      characterViewSink.loadCharacter(match.params.characterId, match.params.variantId);
    }
    return () => characterViewSink.reset();
  }, []);

  SiderHook.useSider(CharacterViewerSider);

  return (
    <div className={styles.container}>
      <CharacterViewerLive2D />
    </div>
  );
};
