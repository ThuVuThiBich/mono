import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement> & { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={15} height={12} {...props}>
    <path
      d="M12.985 0h-5.25a.375.375 0 0 0-.375.375v5.25A.375.375 0 0 0 7.735 6h5.25a.375.375 0 0 0 .375-.375V.375A.375.375 0 0 0 12.985 0ZM5.391 1.5h-3.75a.375.375 0 0 0-.375.375v3.75A.375.375 0 0 0 1.641 6h3.75a.375.375 0 0 0 .375-.375v-3.75a.375.375 0 0 0-.375-.375Z"
      fill="#fff"
    />
    <path
      d="M12.75 7.5H2.25a2.25 2.25 0 0 0 0 4.5h10.5a2.25 2.25 0 0 0 0-4.5ZM3 10.5a.75.75 0 1 1 .75-.75.75.75 0 0 1-.75.75Zm4.5 0a.75.75 0 1 1 .75-.75.75.75 0 0 1-.75.75Zm4.5 0a.75.75 0 1 1 .75-.75.75.75 0 0 1-.75.75Z"
      fill={props.active ? '#FFBA00' : '#9aa3a7'}
      className="two-tone-active"
    />
  </svg>
);

const Memo = memo(SvgComponent);
export default Memo;
