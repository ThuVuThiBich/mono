import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement> & { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={14} {...props}>
    <path
      d="M13 7.5a1 1 0 1 0 1 1 1 1 0 0 0-1-1Zm.5-7.5H2a2 2 0 0 0-2 2 1 1 0 0 0 1 1h1.5a.5.5 0 1 1 0-1h12a.5.5 0 0 0 .5-.5A1.5 1.5 0 0 0 13.5 0Z"
      fill={props.active ? '#FFBA00' : '#9aa3a7'}
      className="two-tone-active"
      opacity={0.25}
    />
    <path
      d="M14.413 3H1a1 1 0 0 1-1-1v10a2 2 0 0 0 2 2h12.413A1.548 1.548 0 0 0 16 12.5v-8A1.547 1.547 0 0 0 14.413 3ZM13 9.5a1 1 0 1 1 1-1 1 1 0 0 1-1 1Z"
      className="two-tone-active"
      fill={props.active ? '#FFBA00' : '#9aa3a7'}
    />
  </svg>
);

const Memo = memo(SvgComponent);
export default Memo;
