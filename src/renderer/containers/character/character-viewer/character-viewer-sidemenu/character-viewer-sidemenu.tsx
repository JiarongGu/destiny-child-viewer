import * as React from 'react';
import { Button, Icon } from 'antd';
import { useSink } from 'redux-sink';
import classnames from 'classnames';

import { PathService } from '@services/path-service';
import { CharacterViewerSink } from '../character-viewer-sink';

import * as styles from './character-viewer-sidemenu.scss';

export const CharacterViewerSideMenu = () => {
  const characterViewSink = useSink(CharacterViewerSink, sink => [sink.metadata!, sink.play]);
  const [collapsed, setCollapsed] = React.useState(false);
  const width = collapsed ? '128px' : '360px';

  const getAssetPath = React.useCallback(path => {
    const pathService = new PathService();
    return pathService.getAssetPath(path);
  }, []);

  const { metadata } = characterViewSink;
  const variants = metadata?.variants.sort((a, b) => parseInt(a, 10) - parseInt(b, 10)) || [];

  return (
    <div className={styles.container} style={{ width }}>
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

      <div
        className={classnames('ant-layout-sider-trigger', styles.trigger)}
        onClick={() => setCollapsed(!collapsed)}
        style={{ width }}
      >
        {collapsed && <Icon type={'left'} />}
        {!collapsed && <Icon type={'right'} />}
      </div>
    </div>
  );
};
