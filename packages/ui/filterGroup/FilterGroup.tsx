import { FC, CSSProperties } from 'react';
import styles from './styles.module.css';
import { Radio, RadioGroupProps, Space } from 'antd';
import clsx from 'clsx';

export interface filterValue {
  value?: any;
  label?: any;
  className?: any;
  disabled?: boolean;
  [key: string]: any;
}

type FilterGroupProps = Partial<RadioGroupProps> & {
  datas: filterValue[];
  filled?: boolean;
  className?: string;
  radioClassName?: string;
  stretch?: boolean;
  style?: CSSProperties;
  isUppercase?: boolean;
};

export const FilterGroup: FC<FilterGroupProps> = ({
  stretch = false,
  datas,
  filled,
  className,
  radioClassName,
  style,
  isUppercase = false,
  ...props
}) => {
  return (
    <Space
      className={clsx(styles.root, className, {
        [styles.stretchItem]: stretch,
        [styles.filled]: filled,
      })}
      style={style}
    >
      <Radio.Group
        className={clsx(styles.filterWrapper, radioClassName, {
          [styles.stretch]: stretch,
        })}
        buttonStyle="solid"
        {...props}
      >
        {datas.map((item) => (
          <Radio.Button
            key={item.value}
            className={clsx(styles.filterItem, item?.className ?? undefined, isUppercase && 'uppercase')}
            value={item.value}
            id={`radio-${item.value}`}
            disabled={item.disabled}
          >
            {item.label}
          </Radio.Button>
        ))}
      </Radio.Group>
    </Space>
  );
};
