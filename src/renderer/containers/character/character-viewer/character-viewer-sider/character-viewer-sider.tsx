import * as React from 'react';
import { Button, Tabs, Icon } from 'antd';
import { useSink } from 'redux-sink';
import classnames from 'classnames';
import axios from 'axios';

import { RenderModelType } from '@models/data';
import { PathService } from '@services/path-service';

import { CharacterViewerSink } from '../character-viewer-sink';
import { CharacterViewerPosition } from '../character-viewer-position/character-viewer-position';

import * as styles from './character-viewer-sider.scss';
import { SiderSink } from '@sinks';
import { CharacterVariantType } from '@models';

export const CharacterViewerSider = () => {
  const characterViewSink = useSink(CharacterViewerSink, sink => [sink.metadata, sink.play, sink.current]);

  const siderSink = useSink(SiderSink, sink => [sink.collapsed]);
  const tabPosition = siderSink.collapsed ? 'right' : 'top';

  const getAssetPath = React.useCallback(path => {
    const pathService = new PathService();
    return pathService.getAssetPath(path);
  }, []);

  const { metadata, current } = characterViewSink;
  const variants = metadata?.variants?.sort((a, b) => parseInt(a, 10) - parseInt(b, 10)) || [];
  const currentVariant = current && metadata?.character.variants[current.variantId];
  const defaultVariant = current && metadata?.character.variants[CharacterVariantType.Default];

  if (defaultVariant) {
    axios.get(`https://altema.jp/destinychild/searchresults?q=${defaultVariant.title}`).then(
      (result) => {
        const matches = new RegExp(`chara\/(?<altemaId>[0-9]*).*`).exec(result.data);
        console.log(matches?.groups?.altemaId);
      }
    );
  }

  return (
    <div className={styles.container}>
      <Tabs className={styles.tabs} tabPosition={tabPosition} onTabClick={() => (siderSink.collapsed = false)}>
        <Tabs.TabPane className={styles.variant} tab={'Variants'} key={'variant'}>
          <div className={styles.variantSelection}>
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
                    className={classnames(styles.variantSelectionButton, {
                      [styles.variantSelectionButtonDisabled]: disabled
                    })}
                    onClick={onClick}
                  />
                );
              })}
          </div>
          <div className={styles.variantDetail}>
            {currentVariant && (
              <div>
                <div>
                  {currentVariant?.name} {currentVariant?.title}
                </div>
                <div>{currentVariant?.description}</div>
              </div>
            )}
            <CharacterViewerPosition />
          </div>
        </Tabs.TabPane>
      </Tabs>
      <div className={styles.controls}>
        <Button shape={'circle'} size={'large'} onClick={() => (characterViewSink.play = !characterViewSink.play)}>
          {characterViewSink.play ? <Icon type={'pause'} /> : <Icon type={'caret-right'} />}
        </Button>
      </div>
    </div>
  );
};
