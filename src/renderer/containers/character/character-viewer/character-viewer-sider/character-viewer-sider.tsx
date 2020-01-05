import * as React from 'react';
import { Button, Tabs, Icon, Tooltip } from 'antd';
import { useSink } from 'redux-sink';

import { SiderSink } from '@sinks';
import { CharacterViewerActionSink } from '../character-viewer-action-sink';
import { CharacterViewerSiderVariants } from '../character-viewer-sider-variants';
import { CharacterViewerSiderTheme } from '../character-viewer-sider-theme';

import * as styles from './character-viewer-sider.scss';

export const CharacterViewerSider = () => {
  const characterAction = useSink(CharacterViewerActionSink, sink => [sink.play]);
  const siderSink = useSink(SiderSink, sink => [sink.collapsed]);

  const tabPosition = siderSink.collapsed ? 'right' : 'top';

  return (
    <div className={styles.container}>
      <Tabs className={styles.tabs} tabPosition={tabPosition} onTabClick={() => (siderSink.collapsed = false)}>
        <Tabs.TabPane tab={'Variant'} key={'variant'}>
          <CharacterViewerSiderVariants />
        </Tabs.TabPane>
        <Tabs.TabPane tab={'Theme'} key={'theme'}>
          <CharacterViewerSiderTheme />
        </Tabs.TabPane>
      </Tabs>
      <div className={styles.controls}>
        <Tooltip title={characterAction.play ? 'Pause' : 'Resume'}>
          <Button shape={'circle'} size={'large'} onClick={() => (characterAction.play = !characterAction.play)}>
            {characterAction.play ? <Icon type={'pause'} /> : <Icon type={'caret-right'} />}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
