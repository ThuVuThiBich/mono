import { FC } from 'react';
import { DatePicker as AntdDatePicker, DatePickerProps } from 'antd';
import styles from './DatePicker.module.css';
import clsx from 'clsx';
import { SurfaceLabel } from '../surfaceLabel';

export type ModifiedInputProps = DatePickerProps & {
  id?: string;
  label?: string;
};

export const DatePicker: FC<ModifiedInputProps> = ({
  label,
  id,
  className,
  size = 'middle',
  ...props
}) => {
  const inputWithSize = styles[size];
  return (
    <SurfaceLabel size={size} id={id} label={label} className={className}>
      <AntdDatePicker
        id={id}
        className={clsx(styles.input, inputWithSize)}
        {...props}
      />
    </SurfaceLabel>
  );
};
