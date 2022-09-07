import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement> & { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} {...props}>
    <path
      d="M10.714 0H1.286A1.286 1.286 0 0 0 0 1.286v9.429A1.286 1.286 0 0 0 1.286 12h9.429A1.286 1.286 0 0 0 12 10.714V1.286A1.286 1.286 0 0 0 10.714 0Zm-.429 8.679A.321.321 0 0 1 9.964 9H8.571v.643a.641.641 0 0 1-.643.643H7.5a.641.641 0 0 1-.643-.643V9H2.036a.321.321 0 0 1-.321-.321V7.607a.321.321 0 0 1 .321-.321h4.821v-.643A.641.641 0 0 1 7.5 6h.429a.641.641 0 0 1 .643.643v.643h1.392a.321.321 0 0 1 .321.321Zm0-4.286a.321.321 0 0 1-.321.321H5.143v.643A.641.641 0 0 1 4.5 6h-.429a.641.641 0 0 1-.643-.643v-.643H2.036a.321.321 0 0 1-.321-.321V3.321A.321.321 0 0 1 2.036 3h1.393v-.643a.641.641 0 0 1 .643-.643H4.5a.641.641 0 0 1 .643.643V3h4.821a.321.321 0 0 1 .321.321Z"
      fill={props.active ? '#FFBA00' : '#bfc1c3'}
      className="two-tone-active"
    />
    <path
      d="M4.5 6a.641.641 0 0 0 .643-.643v-3a.641.641 0 0 0-.643-.643h-.429a.641.641 0 0 0-.643.643v3A.641.641 0 0 0 4.071 6Zm3 4.286h.429a.641.641 0 0 0 .643-.643v-3A.641.641 0 0 0 7.929 6H7.5a.641.641 0 0 0-.643.643v3a.641.641 0 0 0 .643.643Z"
      fill="#fff"
    />
  </svg>
);

const Memo = memo(SvgComponent);
export default Memo;
