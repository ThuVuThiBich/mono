import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement> & { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={10.609} {...props}>
    <path
      d="m5.569 1.927 2.181 2.18H.8a.8.8 0 0 0-.8.8v.8a.8.8 0 0 0 .8.8h6.95L5.569 8.682a.8.8 0 0 0 0 1.127l.565.565a.8.8 0 0 0 1.127 0l4.505-4.504a.8.8 0 0 0 0-1.127L7.261.234a.8.8 0 0 0-1.127 0L5.569.8a.8.8 0 0 0 0 1.127Z"
      fill={props.active ? '#FFBA00' : '#bfc1c3'}
      className="two-tone-active"
    />
  </svg>
);

const Memo = memo(SvgComponent);
export default Memo;
