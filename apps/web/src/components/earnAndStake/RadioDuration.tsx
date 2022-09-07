import { Radio, RadioGroupProps } from 'antd';
import React, { FC } from 'react';
import styles from './RadioDuration.module.less';

const RadioDuration: FC<RadioGroupProps> = ({ ...props }) => {
  return (
    <Radio.Group {...props} className={styles.root}>
      <Radio.Button value={30}>30</Radio.Button>
      <Radio.Button value={60}>60</Radio.Button>
      <Radio.Button value={90}>90</Radio.Button>
    </Radio.Group>
  );
};

export default RadioDuration;
