/* eslint-disable react/display-name */
import { Input as AntdInput, InputRef } from "antd";
import clsx from "clsx";
import { forwardRef, PropsWithChildren } from "react";
import styles from "./styles.module.css";
import { InputProps } from "./types";

const Input = forwardRef<InputRef, PropsWithChildren<InputProps>>(
  (props, ref) => {
    return (
      <AntdInput
        ref={ref}
        className={clsx(styles.input, props.className)}
        {...props}
      />
    );
  }
);

export default Input;
