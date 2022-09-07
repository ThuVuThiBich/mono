import { InputProps as AntdInputProps } from "antd";

export type InputProps = Pick<
  AntdInputProps,
  | "placeholder"
  | "id"
  | "disabled"
  | "defaultValue"
  | "addonAfter"
  | "addonBefore"
  | "prefix"
  | "size"
  | "type"
  | "value"
  | "onChange"
  | "onPressEnter"
  | "className"
  | "readOnly"
  | "autoFocus"
>;
