import { FC, memo } from 'react';
import styles from './LockInput.module.less';

import NumberFormat, { NumberFormatValues } from 'react-number-format';

interface ILockInputProps {
  value: any;
  onValueChange?: (values: NumberFormatValues) => void;
  prefix: string;
  precision?: any;
  disabled?: boolean;
  label?: string;
  isAllowed?: ((values: NumberFormatValues) => boolean) | undefined;
}

const LockInput: FC<ILockInputProps> = ({
  disabled,
  precision,
  value,
  onValueChange,
  label,
  isAllowed,
  prefix = 'ETH',
}) => {
  return (
    <div className={styles.lockInput}>
      <label htmlFor="lock-input" className="uppercase">
        {label}
      </label>
      <NumberFormat
        disabled={disabled}
        value={value}
        onValueChange={onValueChange}
        id="lock-input"
        allowNegative={false}
        decimalScale={precision || 15}
        thousandSeparator
        isAllowed={isAllowed}
      />
      <span>{prefix}</span>
    </div>
  );
};

export default memo(LockInput);
