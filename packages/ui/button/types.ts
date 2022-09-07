import React, { CSSProperties } from "react";

export interface ButtonProps {
  type?:
    | "primary"
    | "secondary"
    | "info"
    | "turqoise"
    | "buy"
    | "sell"
    | "default"
    | "blue"
    | "text"
    | "error"
    | "success"
    | "accent-turqoise"
    | "accent-blue"
    | "disabled";
  size?: "large" | "middle" | "small";
  shape?: "circle" | "round";
  onClick?(): void;
  onMouseEnter?(): void;
  onMouseLeave?(): void;
  className?: string;
  htmlType?: "submit" | "button" | "reset";
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  id?: any;
  href?: string;
  style?: CSSProperties;
}
