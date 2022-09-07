import clsx from "clsx";
import { CSSProperties, FC } from "react";
import styles from "./styles.module.css";
import { TabsProps } from "./types";

const Tabs: FC<TabsProps> = ({ children, className }) => {
  return <div className={clsx(styles.root, className)}>{children}</div>;
};
export default Tabs;

export const TabPane: FC<{ active?: boolean; onClick: () => void }> = ({
  children,
  active,
  onClick,
}) => {
  return (
    <>
      <button
        onClick={onClick}
        className={clsx(styles.tabPane, active && styles.active)}
      >
        {children}
      </button>
    </>
  );
};
