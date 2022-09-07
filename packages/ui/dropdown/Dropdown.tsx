import styles from "./styles.module.css";
import { Dropdown as AntdDropdown } from "antd";
import clsx from "clsx";
import { FC } from "react";
import { DropdownProps } from "./types";

const Dropdown: FC<DropdownProps> = ({
  className,
  children,
  overlay = <></>,
  overlayStyle,
  overlayClassName,
  ...props
}) => {
  return (
    <AntdDropdown
      className={clsx(styles.dropdown, className)}
      overlayStyle={overlayStyle}
      overlay={overlay}
      overlayClassName={clsx(styles.overlay, overlayClassName)}
      {...props}
    >
      {children}
    </AntdDropdown>
  );
};

export default Dropdown;
