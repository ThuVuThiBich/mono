import { StepsProps as AntdStepsProps } from 'antd';
import { CSSProperties } from 'react';

export type StepsProps = Partial<AntdStepsProps> & {
  className?: string;
  style?: CSSProperties;
};
