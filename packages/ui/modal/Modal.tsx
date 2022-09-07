import { FC } from "react";
import styles from "./styles.module.css";
import { Modal as AntModal } from "antd";
import clsx from "clsx";
import { ModalProps } from "./types";

const Modal: FC<ModalProps> = ({ children, ...props }) => {
  return (
    <AntModal className={clsx(styles.modal)} {...props}>
      {children}
    </AntModal>
  );
};

export default Modal;
