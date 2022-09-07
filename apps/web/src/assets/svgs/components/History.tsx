import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement> & { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} {...props}>
    <path
      d="M3.234 9.489a4.452 4.452 0 1 0-.284-6.733l1.228 1.228a.387.387 0 0 1-.274.661H.387A.387.387 0 0 1 0 4.258V.741A.387.387 0 0 1 .661.467l1.194 1.195a6 6 0 1 1 .379 9.01.581.581 0 0 1-.045-.862l.273-.273a.581.581 0 0 1 .772-.048Z"
      fill={props.active ? '#FFBA00' : '#9aa3a7'}
      className="two-tone-active"
    />
    <path
      d="M6.774 3.484v2.525l.985.766a.581.581 0 0 1 .1.815l-.238.305a.581.581 0 0 1-.815.1l-1.58-1.229V3.484a.581.581 0 0 1 .581-.581h.387a.581.581 0 0 1 .58.581Z"
      fill="#fff"
    />
  </svg>
);

const Memo = memo(SvgComponent);
export default Memo;
