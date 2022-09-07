import { FC } from 'react';
import styles from './Switch.module.css';
import { Switch as AntSwitch, SwitchProps } from 'antd';
import clsx from 'clsx';

interface SwitcherProps {
  value?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  switchProps?: SwitchProps;
}

export const StyledSwitch: FC<SwitcherProps> = ({ value, onChange, disabled, switchProps }) => {
  return (
    <div className={styles.root}>
      <div className={clsx(styles.switcherBtn)}>
        <AntSwitch
          disabled={disabled}
          checked={value}
          onChange={(value) => {
            if (onChange) onChange(value);
          }}
          {...switchProps}
        />
      </div>
    </div>
  );
};
