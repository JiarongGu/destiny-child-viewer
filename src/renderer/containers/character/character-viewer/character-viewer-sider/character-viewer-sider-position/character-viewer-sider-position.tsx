import * as React from 'react';
import { useSink } from 'redux-sink';
import classnames from 'classnames';

import { Live2DHelper } from '@utils';
import { PercentageInput } from '@components';
import { CharacterVariantPosition } from '@models/data';
import { CharacterViewerSink } from '../../character-viewer-sink';

import * as styles from './character-viewer-sider-position.scss';
import { Button, Tooltip, Icon } from 'antd';

export interface CharacterViewerSiderPositionProps {
  className?: string;
}

export const CharacterViewerSiderPosition: React.FunctionComponent<CharacterViewerSiderPositionProps> = ({
  className
}) => {
  const characterViewSink = useSink(CharacterViewerSink, sink => [sink.position]);
  const [saving, setSaving] = React.useState(false);
  const position = characterViewSink.position;

  const onChange = React.useCallback(
    (type: keyof CharacterVariantPosition) => (percentage: number) => {
      if (position) {
        characterViewSink.position = {
          ...position,
          [type]: Live2DHelper.actual(percentage)
        };
      }
    },
    [position]
  );

  const savePosition = React.useCallback(() => {
    setSaving(true);
    characterViewSink.savePosition().then(() => setSaving(false));
  }, []);

  return (
    <div className={classnames(styles.container, className)}>
      {saving && <div>Saving...</div>}
      <div className={styles.position}>
        <PercentageInput
          label={'X:'}
          value={Live2DHelper.percentage(position?.x || 0)}
          min={-120}
          max={120}
          onChange={onChange('x')}
        />
        <PercentageInput
          label={'Y:'}
          value={Live2DHelper.percentage(position?.y || 0)}
          min={-120}
          max={120}
          onChange={onChange('y')}
        />
        <PercentageInput
          label={'Scale:'}
          min={0}
          value={Live2DHelper.percentage(position?.scale || 0)}
          onChange={onChange('scale')}
        />
      </div>
      <div className={styles.buttons}>
        <Tooltip title={'reset'}>
          <Button className={styles.button} size={'small'}>
            <Icon type={'sync'} />
          </Button>
        </Tooltip>
        <Tooltip title={'copy'}>
          <Button className={styles.button} size={'small'}>
            <Icon type={'copy'} />
          </Button>
        </Tooltip>
        <Tooltip title={'paste'}>
          <Button className={styles.button} size={'small'}>
            <Icon type={'snippets'} />
          </Button>
        </Tooltip>
        <Tooltip title={'save'}>
          <Button className={styles.button} size={'small'} onClick={savePosition}>
            <Icon type={'save'} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
