import { InputNumberProps as AntdInputNumberProps } from "antd";

export type InputNumberProps = Pick<
  AntdInputNumberProps,
  | "defaultValue"
  | "decimalSeparator"
  | "disabled"
  | "formatter"
  | "max"
  | "min"
  | "parser"
  | "precision"
  | "size"
  | "step"
  | "value"
  | "onChange"
  | "onPressEnter"
  | "className"
>;
