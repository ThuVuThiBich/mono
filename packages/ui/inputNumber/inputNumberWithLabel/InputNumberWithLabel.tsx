import { FC, memo } from 'react';
import styles from './styles.module.css';

import NumberFormat, { NumberFormatValues } from 'react-number-format';
import clsx from 'clsx';
interface IInputNumberWithLabelProps {
  label?: string;
  id?: string;
  value?: any;
  onValueChange?: (values: NumberFormatValues) => void;
  prefix: string;
  decimalScale?: number;
  name?: string;
  isAllowed?: ((values: NumberFormatValues) => boolean) | undefined;
  className?: string;
  placeholder?: string;
  thousandSeparator?: boolean;
  maxLength?: number;
}

const InputNumberWithLabel: FC<IInputNumberWithLabelProps> = ({
  id,
  label,
  value,
  onValueChange,
  decimalScale = 15,
  prefix = 'USD',
  name,
  isAllowed,
  className,
  placeholder = '0',
  thousandSeparator = true,
  maxLength,
}) => {
  return (
    <div className={clsx(styles.inputNumber, className)}>
      <label htmlFor={id} className="uppercase">
        {label}
      </label>
      <NumberFormat
        name={name}
        placeholder={placeholder}
        value={value}
        onValueChange={onValueChange}
        id={id}
        allowNegative={false}
        decimalScale={decimalScale}
        thousandSeparator={thousandSeparator}
        allowEmptyFormatting
        isAllowed={isAllowed}
        maxLength={maxLength}
      />
      <span>{prefix}</span>
    </div>
  );
};
export default memo(InputNumberWithLabel);
