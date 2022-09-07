import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement> & { active?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={17.143} height={12} {...props}>
    <path
      d="M2.571 5.143A1.714 1.714 0 1 0 .857 3.429a1.714 1.714 0 0 0 1.714 1.714Zm12 0a1.714 1.714 0 1 0-1.714-1.714 1.714 1.714 0 0 0 1.714 1.714Zm.857.857h-1.714a1.708 1.708 0 0 0-1.207.5 3.925 3.925 0 0 1 2.012 2.931h1.766a.857.857 0 0 0 .857-.857v-.857A1.714 1.714 0 0 0 15.429 6ZM1.714 6A1.714 1.714 0 0 0 0 7.714v.857a.857.857 0 0 0 .857.857h1.766A3.925 3.925 0 0 1 4.636 6.5 1.708 1.708 0 0 0 3.429 6Zm6.857-6L7.285.643 6 0v2.143h5.143V0L9.857.643Z"
      fill={props.active ? '#FFBA00' : '#9aa3a7'}
      className="two-tone-active"
      opacity={0.4}
    />
    <path
      d="M8.572 6a2.571 2.571 0 0 0 2.571-2.571V3H6v.429A2.571 2.571 0 0 0 8.572 6Zm2.057.857h-.223a4.141 4.141 0 0 1-3.669 0h-.223a3.086 3.086 0 0 0-3.085 3.086v.771A1.286 1.286 0 0 0 4.715 12h7.714a1.286 1.286 0 0 0 1.286-1.286v-.771a3.086 3.086 0 0 0-3.086-3.086Z"
      fill="#fff"
    />
  </svg>
);

const Memo = memo(SvgComponent);
export default Memo;
