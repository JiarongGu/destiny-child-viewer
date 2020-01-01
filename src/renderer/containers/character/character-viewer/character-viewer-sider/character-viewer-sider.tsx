import * as React from 'react';
import { Button } from 'antd';
import { useSink } from 'redux-sink';

import { PathService } from '@services/path-service';
import { CharacterViewerSink } from '../character-viewer-sink';

import * as styles from './character-viewer-sider.scss';
import { SiderHook } from '@hooks';

export const CharacterViewerSider = () => {
  const characterViewSink = useSink(CharacterViewerSink, sink => [sink.metadata!, sink.play]);

  SiderHook.useSiderCollapse(
    (context) => {
      context.width = context.collapsed ? '128px' : '360px';
    },
    (context) => {
      context.collapsed = false;
    }
  );

  const getAssetPath = React.useCallback(path => {
    const pathService = new PathService();
    return pathService.getAssetPath(path);
  }, []);

  const { metadata } = characterViewSink;
  const variants = metadata?.variants?.sort((a, b) => parseInt(a, 10) - parseInt(b, 10)) || [];

  return (
    <>
      {metadata &&
        variants.map(variant => (
          <div key={variant}>
            <img
              src={getAssetPath(metadata!.icon[variant].home)}
              alt={variant}
              className={styles.button}
              onClick={() => characterViewSink.loadCharacter(metadata.id, variant)}
            />
          </div>
        ))}
      <Button onClick={() => (characterViewSink.play = !characterViewSink.play)}>
        {characterViewSink.play ? 'Pause' : 'Resume'}
      </Button>
    </>
  );
};
