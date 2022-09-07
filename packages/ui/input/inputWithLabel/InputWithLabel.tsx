import { forwardRef, useState } from 'react';
import { Input as AntdInput, InputProps, InputRef } from 'antd';
import styles from './styles.module.css';
import clsx from 'clsx';
import { SurfaceLabel } from '@cross/ui';

const { Password: AntPassword } = AntdInput;
export type ModifiedInputProps = Partial<InputProps> & {
  id?: string;
  label?: any;
  searchForm?: boolean;
  className?: string;
  surfaceClassName?: string;
};

export const InputWithLabel = forwardRef<InputRef, ModifiedInputProps>(function Input(
  {
    className,
    label,
    id,
    size = "middle",
    searchForm,
    surfaceClassName,
    ...props
  },
  ref
) {
  const inputWithSize = styles[size];
  const isSearchForm = searchForm ? "searchForm" : "";
  const [isFocused, setFocused] = useState(false);

  return (
    <SurfaceLabel
      size={size}
      id={id}
      label={label}
      className={clsx(isFocused ? styles.surfaceFocused : "", surfaceClassName)}
    >
      <AntdInput
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        ref={ref}
        id={id}
        className={clsx(styles.input, inputWithSize, isSearchForm, className)}
        {...props}
      />
    </SurfaceLabel>
  );
});

export const PasswordWithLabel = forwardRef<InputRef, ModifiedInputProps>(
  // function Input({ label, id, className, size = "middle", ...props }, ref) {
  function Input({ label, id, size = "middle", ...props }, ref) {
    const inputWithSize = styles[`input__${size}`];
    return (
      <SurfaceLabel size={size} id={id} label={label}>
        <AntPassword
          ref={ref}
          id={id}
          className={clsx(styles.input, inputWithSize)}
          {...props}
        />
      </SurfaceLabel>
    );
  }
);
