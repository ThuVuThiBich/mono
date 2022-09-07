import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12.194} {...props}>
    <path
      d="M9.484 1.309a6 6 0 1 1-6.973 0 .582.582 0 0 1 .847.186l.382.68a.58.58 0 0 1-.16.75 4.064 4.064 0 1 0 4.836 0 .577.577 0 0 1-.157-.748l.382-.68a.58.58 0 0 1 .842-.189ZM6.968 6.387V.581A.579.579 0 0 0 6.387 0h-.774a.579.579 0 0 0-.581.581v5.806a.579.579 0 0 0 .581.581h.774a.579.579 0 0 0 .581-.581Z"
      fill="#9aa3a7"
      className="two-tone-active"
    />
  </svg>
);

const Memo = memo(SvgComponent);
export default Memo;
