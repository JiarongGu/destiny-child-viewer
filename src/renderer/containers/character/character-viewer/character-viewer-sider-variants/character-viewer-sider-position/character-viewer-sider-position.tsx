import * as React from 'react';
import { useSink } from 'redux-sink';
import classnames from 'classnames';

import { Live2DHelper, VariantPosition } from '@shared';
import { PercentageInput } from '@components';
import { CharacterViewerSink } from '../../character-viewer-sink';

import * as styles from './character-viewer-sider-position.scss';
import { Button, Tooltip, Icon, Spin } from 'antd';

export interface CharacterViewerSiderPositionProps {
  className?: string;
}

const PositionButton = ({ onClick, disabled, title, icon }) => {
  return (
    <Tooltip title={title} placement={'topRight'}>
      <Button className={styles.button} size={'small'} onClick={onClick} disabled={disabled}>
        <Icon type={icon} />
      </Button>
    </Tooltip>
  );
};

export const CharacterViewerSiderPosition: React.FunctionComponent<CharacterViewerSiderPositionProps> = ({
  className
}) => {
  const characterViewSink = useSink(CharacterViewerSink, sink => [sink.position, sink.positionUpdated]);
  const [spinning, setSpinning] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const copyRef = React.useRef<VariantPosition>();
  const { position, positionUpdated } = characterViewSink;

  const onChange = React.useCallback(
    (type: keyof VariantPosition) => (percentage: number) => {
      const actualValue = Live2DHelper.actual(percentage);
      if (position && position[type] !== actualValue) {
        characterViewSink.position = {
          ...position,
          [type]: Live2DHelper.actual(percentage)
        };
      }
    },
    [position]
  );

  const savePosition = React.useCallback(() => {
    setSpinning(true);
    characterViewSink.savePosition().then(() => setSpinning(false));
  }, []);

  const copyPosition = React.useCallback(() => {
    copyRef.current = position;
    setCopied(true);
  }, [position]);

  const pastePosition = React.useCallback(() => {
    if (copyRef.current) {
      characterViewSink.position = copyRef.current;
    }
  }, [position]);

  const resetPosition = React.useCallback(() => {
    characterViewSink.resetPosition();
  }, []);

  return (
    <div className={classnames(styles.container, className)}>
      <Spin spinning={spinning}>
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
          <PositionButton title={'reset'} icon={'sync'} onClick={resetPosition} disabled={!positionUpdated} />
          <PositionButton title={'copy'} icon={'copy'} onClick={copyPosition} disabled={false} />
          <PositionButton title={'paste'} icon={'snippets'} onClick={pastePosition} disabled={!copied} />
          <PositionButton title={'save'} icon={'save'} onClick={savePosition} disabled={!positionUpdated} />
        </div>
      </Spin>
    </div>
  );
};
