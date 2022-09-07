import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement> & { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={9} height={12} {...props}>
    <path
      d="M6.75 0A.75.75 0 0 0 6 .75v3h1.5v-3A.75.75 0 0 0 6.75 0Zm-4.5 0a.75.75 0 0 0-.75.75v3H3v-3A.75.75 0 0 0 2.25 0Z"
      fill={props.active ? '#FFBA00' : '#9aa3a7'}
      className="two-tone-active"
    />
    <path
      d="M9 4.125v.75a.375.375 0 0 1-.375.375H8.25V6a3.751 3.751 0 0 1-3 3.675V12h-1.5V9.675A3.752 3.752 0 0 1 .75 6v-.75H.375A.375.375 0 0 1 0 4.875v-.75a.375.375 0 0 1 .375-.375h8.25A.375.375 0 0 1 9 4.125Z"
      fill="#fff"
    />
  </svg>
);

const Memo = memo(SvgComponent);
export default Memo;
