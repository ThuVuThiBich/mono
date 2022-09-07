import { notification } from "antd";
import { ArgsProps, NotificationPlacement } from "antd/lib/notification";
import {
  CheckOutlined,
  CloseOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
import styles from "./styles.module.css";

type ToastProps = ArgsProps;

const renderIcon = (type: string) => {
  switch (type) {
    case "error":
      return <CloseOutlined className={styles.iconError} />;
    case "success":
      return <CheckOutlined className={styles.iconSuccess} />;
    case "warning":
      return <InfoCircleFilled className={styles.iconWarning} />;
  }
};

const Toast = (
  type: string,
  message: string | undefined,
  placement: NotificationPlacement = "bottomRight"
) => {
  const params: ToastProps = {
    message,
    placement,
    icon: renderIcon(type),
    duration: 4,
  };

  switch (type) {
    case "error":
      notification.error(params);
      break;
    case "success":
      notification.success(params);
      break;
    case "warning":
      notification.warning(params);
      break;
  }
};

export default Toast;
