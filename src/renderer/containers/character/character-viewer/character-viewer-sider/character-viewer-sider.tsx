import * as React from 'react';
import { Button, Tabs } from 'antd';
import { useSink } from 'redux-sink';
import classnames from 'classnames';

import { RenderModelType } from '@models/data';
import { PathService } from '@services/path-service';
import { CharacterViewerSink } from '../character-viewer-sink';

import * as styles from './character-viewer-sider.scss';
import { SiderSink } from '@sinks';

export const CharacterViewerSider = () => {
  const characterViewSink = useSink(CharacterViewerSink, sink => [sink.metadata!, sink.play]);
  const siderSink = useSink(SiderSink, sink => [sink.collapsed]);
  const tabPosition = siderSink.collapsed ? 'right' : 'top';

  const getAssetPath = React.useCallback(path => {
    const pathService = new PathService();
    return pathService.getAssetPath(path);
  }, []);

  const metadata = characterViewSink.metadata;
  const variants = metadata?.variants?.sort((a, b) => parseInt(a, 10) - parseInt(b, 10)) || [];
  return (
    <div className={styles.container}>
      <Tabs tabPosition={tabPosition} className={styles.tabs} onTabClick={() => (siderSink.collapsed = false)}>
        <Tabs.TabPane tab={'Variants'} key={'variant'}>
          <div>
            {metadata &&
              variants.map(variant => {
                const disabled = metadata.render[variant].modeltype !== RenderModelType.Live2D;
                const onClick =
                  (!disabled && (() => characterViewSink.loadCharacter(metadata.id, variant))) || undefined;
                return (
                  <img
                    key={variant}
                    src={getAssetPath(metadata!.icon[variant].home)}
                    alt={variant}
                    className={classnames(styles.button, { [styles.buttonDisabled]: disabled })}
                    onClick={onClick}
                  />
                );
              })}
          </div>
        </Tabs.TabPane>
      </Tabs>
      <div>
        <Button onClick={() => (characterViewSink.play = !characterViewSink.play)}>
          {characterViewSink.play ? 'Pause' : 'Resume'}
        </Button>
      </div>
    </div>
  );
};
