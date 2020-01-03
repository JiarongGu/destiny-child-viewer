import * as React from 'react';
import classnames from 'classnames';

import { MathHelper } from '@shared';
import * as styles from './percentage-input.scss';

export interface PercentageInputProps {
  className?: string;
  label: string;
  value: number;
  onChange?: (value: number) => void;
  digit?: number;
  min?: number;
  max?: number;
}

export const PercentageInput: React.FunctionComponent<PercentageInputProps> = props => {
  const { className, label, value, onChange, digit, min, max } = props;
  const [percentage, setPercentage] = React.useState('0');

  React.useEffect(() => {
    setPercentage((value || 0).toString());
  }, [value]);

  const onChangeHandler = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const valid = /^\-?[0-9]*\.?[0-9]*$/.test(value);
      const isDot = value.lastIndexOf('.') !== value.length - 1;
      const accuracy = digit || 1;

      if (valid) {
        const numberValue = parseFloat(value);
        if (!Number.isNaN(numberValue) && isDot) {
          let formattedValue = MathHelper.floor(numberValue, accuracy);

          if (min) {
            formattedValue = Math.max(formattedValue, min);
          }

          if (max) {
            formattedValue = Math.min(formattedValue, max);
          }

          setPercentage(formattedValue.toString());
          onChange && onChange(formattedValue);
        } else {
          setPercentage(value);
        }
      }
    },
    [value, onChange, digit, min, max]
  );

  return (
    <div className={classnames(styles.group, className)}>
      <label className={styles.label}>{label}</label>
      <input className={styles.input} value={percentage} onChange={onChangeHandler} />
      <label className={styles.sign}>%</label>
    </div>
  );
};
