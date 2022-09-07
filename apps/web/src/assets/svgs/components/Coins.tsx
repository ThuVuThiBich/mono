import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement> & { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} {...props}>
    <path
      d="M9.75 7.3C11.093 7.04 12 6.557 12 6V5a5.756 5.756 0 0 1-2.25.809Zm-.11-2.229c1.406-.253 2.36-.75 2.36-1.32v-1a7.63 7.63 0 0 1-3.766.98A2.625 2.625 0 0 1 9.64 5.07ZM12 1.5C12 .673 9.984 0 7.5 0S3 .673 3 1.5 5.016 3 7.5 3 12 2.327 12 1.5Z"
      fill={props.active ? '#FFBA00' : '#bfc1c3'}
      className="two-tone-active"
    />
    <path
      d="M4.5 7.5C6.984 7.5 9 6.661 9 5.625S6.984 3.75 4.5 3.75 0 4.589 0 5.625 2.016 7.5 4.5 7.5ZM0 9.5v1c0 .827 2.016 1.5 4.5 1.5S9 11.327 9 10.5v-1a8.523 8.523 0 0 1-4.5 1A8.523 8.523 0 0 1 0 9.499Zm0-2.459V8.25c0 .827 2.016 1.5 4.5 1.5S9 9.077 9 8.25V7.041A7.548 7.548 0 0 1 4.5 8.25 7.548 7.548 0 0 1 0 7.041Z"
      fill="#fff"
    />
  </svg>
);

const Memo = memo(SvgComponent);
export default Memo;
