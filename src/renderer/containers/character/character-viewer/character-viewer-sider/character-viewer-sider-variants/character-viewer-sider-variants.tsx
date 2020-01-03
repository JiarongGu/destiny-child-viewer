import * as React from 'react';
import { useSink } from 'redux-sink';
import classnames from 'classnames';

import { RenderModelType } from '@models/data';
import { PathService } from '@services/path-service';

import { CharacterViewerSink } from '../../character-viewer-sink';
import { CharacterViewerSiderPosition } from '../character-viewer-sider-position';

import * as styles from './character-viewer-sider-variants.scss';

export const CharacterViewerSiderVariants = () => {
  const characterViewSink = useSink(CharacterViewerSink, sink => [sink.metadata, sink.current]);
  const { metadata, current } = characterViewSink;
  const variants = metadata?.variants?.sort((a, b) => parseInt(a, 10) - parseInt(b, 10)) || [];
  const currentVariant = current?.variantId && metadata?.character?.variants[current.variantId];

  return (
    <div className={styles.container}>
      <div className={styles.selection}>
        {metadata &&
          variants.map(variant => {
            const disabled = metadata.render[variant].modeltype !== RenderModelType.Live2D;
            const onClick = (!disabled && (() => characterViewSink.loadCharacter(metadata.id, variant))) || undefined;
            return (
              <img
                key={variant}
                src={metadata!.icon[variant].home}
                alt={variant}
                className={classnames(styles.selectionButton, {
                  [styles.selectionButtonDisabled]: disabled
                })}
                onClick={onClick}
              />
            );
          })}
      </div>
      <div className={styles.detail}>
        {currentVariant && (
          <div className={styles.detailTitle}>
            <div>
              {currentVariant?.name} {currentVariant?.title}
            </div>
            <div>{currentVariant?.description}</div>
          </div>
        )}
        <CharacterViewerSiderPosition className={styles.position} />
      </div>
    </div>
  );
};
