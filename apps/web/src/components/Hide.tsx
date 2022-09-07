import React, { FC } from 'react';

const Hide: FC<{ if?: boolean }> = (props) => {
  return props.if ? null : <>{props.children}</>;
};

export default Hide;
