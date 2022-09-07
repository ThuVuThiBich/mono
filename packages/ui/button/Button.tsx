import { Button as ButtonAntd } from 'antd';
import clsx from 'clsx';
import { forwardRef, PropsWithChildren } from 'react';
import styles from './styles.module.css';
import { ButtonProps } from './types';

const Button = forwardRef<HTMLElement, PropsWithChildren<ButtonProps>>(
  function Button(
    {
      children,
      id,
      block,
      type = 'default',
      size = 'middle',
      htmlType = 'button',
      className,
      disabled,
      loading,
      onClick,
      ...props
    },
    ref
  ) {
    return (
      <ButtonAntd
        id={id}
        htmlType={htmlType}
        className={clsx(styles.root, styles[type], styles[size], className)}
        ref={ref}
        type={
          type === 'primary' || type === 'secondary' ? 'primary' : undefined
        }
        onClick={onClick}
        disabled={disabled}
        loading={loading}
        block={block}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        style={props.style}
        {...props}
      >
        {children}
      </ButtonAntd>
    );
  }
);

export default Button;
