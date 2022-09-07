import { Avatar as AntdAvatar } from "antd";
import clsx from "clsx";
import { forwardRef, PropsWithChildren } from "react";
import styles from "./styles.module.css";
import { AvatarProps } from "./types";

const Avatar = forwardRef<HTMLElement, PropsWithChildren<AvatarProps>>(
  function Avatar(
    { className, noBorder, type = "primary", children, ...props },
    ref
  ) {
    return (
      <AntdAvatar
        ref={ref}
        className={clsx(styles.avatar, className)}
        {...props}
      >
        {children}
      </AntdAvatar>
    );
  }
);

export default Avatar;
