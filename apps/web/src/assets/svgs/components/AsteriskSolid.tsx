import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={7.333} height={8} {...props}>
    <path
      d="M7.139 5.22 4.917 4l2.222-1.22a.375.375 0 0 0 .144-.516l-.3-.527a.375.375 0 0 0-.52-.137L4.292 2.917 4.346.383A.375.375 0 0 0 3.971 0h-.608a.375.375 0 0 0-.375.383l.054 2.534L.874 1.6a.375.375 0 0 0-.519.133l-.3.527a.375.375 0 0 0 .144.516L2.417 4 .195 5.22a.375.375 0 0 0-.144.516l.3.527a.375.375 0 0 0 .519.133l2.168-1.314-.054 2.534A.375.375 0 0 0 3.363 8h.609a.375.375 0 0 0 .375-.383l-.054-2.534L6.463 6.4a.375.375 0 0 0 .519-.133l.3-.527a.375.375 0 0 0-.143-.52Z"
      fill="#cdd1d3"
    />
  </svg>
);

const Memo = memo(SvgComponent);
export default Memo;
