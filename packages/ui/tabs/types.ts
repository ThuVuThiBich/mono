import { TabsProps as AntdTabsProps } from "antd";
import { CSSProperties } from "react";

export interface TabsProps extends AntdTabsProps {
  className?: string;
  style?: CSSProperties;
}
