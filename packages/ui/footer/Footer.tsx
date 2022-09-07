/* eslint-disable react/display-name */
import { Layout } from "antd";
import clsx from "clsx";
import { forwardRef, PropsWithChildren } from "react";
import styles from "./styles.module.css";
import { FooterProps } from "./types";

const AntdFooter = Layout.Footer;

const Footer = forwardRef<HTMLElement, PropsWithChildren<FooterProps>>(
  (props, ref) => (
    <AntdFooter
      className={clsx(styles.footer, props.className)}
      ref={ref}
      {...props}
    >
      {props.children}
    </AntdFooter>
  )
);

export default Footer;
