import * as React from 'react';
import { Button, Tabs, Icon, Tooltip } from 'antd';
import { useSink } from 'redux-sink';

import { SiderSink } from '@sinks';
import { CharacterViewerSink } from '../character-viewer-sink';
import { CharacterViewerSiderVariants } from '../character-viewer-sider-variants';

import * as styles from './character-viewer-sider.scss';
import { CharacterViewerSiderTheme } from '../character-viewer-sider-theme';

export const CharacterViewerSider = () => {
  const characterViewSink = useSink(CharacterViewerSink, sink => [sink.play]);
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
        <Tooltip title={characterViewSink.play ? 'Pause' : 'Resume'}>
          <Button shape={'circle'} size={'large'} onClick={() => (characterViewSink.play = !characterViewSink.play)}>
            {characterViewSink.play ? <Icon type={'pause'} /> : <Icon type={'caret-right'} />}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
