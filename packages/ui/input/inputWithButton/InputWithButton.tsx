import { Button, ButtonProps } from "@cross/ui";
import { Input as AntdInput } from "antd";
import clsx from "clsx";
import { FC, ReactNode } from "react";
import { InputProps } from "../types";
import styles from "./styles.module.css";


type InputWithButtonProps = Omit<InputProps, "className"> & {
  buttonProps?: Omit<ButtonProps, "size">;
  inputProps?: InputProps;
  enterButton: ReactNode;
  className?: string;
};

const InputWithButton: FC<InputWithButtonProps> = ({
  enterButton,
  inputProps,
  buttonProps,
  className,
  ...props
}) => {
  return (
    <div className={styles.root}>
      <AntdInput
        className={clsx(styles.input, inputProps?.className)}
        {...props}
      />
      <Button
        type="primary"
        {...buttonProps}
        className={clsx(buttonProps?.className, className)}
        size={props.size}
      >
        {enterButton}
      </Button>
    </div>
  );
};

export default InputWithButton;
