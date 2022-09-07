import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement> & { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={10.5} {...props}>
    <path
      d="M5.25 6.75v3.75H1.5a.75.75 0 0 1-.75-.75v-3Zm0-3.75H.75a.75.75 0 0 0-.75.75v1.875A.375.375 0 0 0 .375 6H5.25Zm6 0h-4.5v3h4.875A.375.375 0 0 0 12 5.625V3.75a.75.75 0 0 0-.75-.75Zm-4.5 7.5h3.75a.75.75 0 0 0 .75-.75v-3h-4.5Z"
      fill={props.active ? '#FFBA00' : '#9aa3a7'}
      className="two-tone-active"
    />
    <path
      d="M5.25 10.5h1.5V6.75h-1.5ZM8.427 0C7.447 0 6.813.5 6 1.6 5.187.5 4.553 0 3.573 0A2.071 2.071 0 0 0 1.5 2.063a2.007 2.007 0 0 0 .238.938h1.833a.938.938 0 0 1 0-1.875c.469 0 .815.077 2.029 1.875h-.35v3h1.5V3H6.4c1.211-1.793 1.547-1.875 2.029-1.875a.938.938 0 1 1 0 1.875h1.835a2.036 2.036 0 0 0 .236-.937A2.071 2.071 0 0 0 8.427 0Z"
      fill="#fff"
    />
  </svg>
);

const Memo = memo(SvgComponent);
export default Memo;
