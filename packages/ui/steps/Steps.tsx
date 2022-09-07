import clsx from 'clsx';
import { FC } from 'react';
import styles from './styles.module.css';
import { Steps as AntdSteps } from 'antd';
import { StepsProps } from './types';

 const Steps: FC<StepsProps> & { Step: typeof AntdSteps.Step } = ({ children, className, ...props }) => {
  return (
    <AntdSteps className={clsx(styles.root, className)} {...props}>
      {children}
    </AntdSteps>
  );
};

Steps.Step = AntdSteps.Step;

export default Steps