import { AvatarProps as AntdAvatarProps } from "antd";

export interface AvatarProps extends AntdAvatarProps {
  noBorder?: boolean;
  type?: string;
}
