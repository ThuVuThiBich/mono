import { memo } from 'react';

const Candle = () => (
  <svg width="20" height="20" viewBox="0 0 24 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_15_2)">
      <path
        d="M12 10.5C14.1 10.5 15.75 8.85 15.75 6.75C15.75 4.875 13.05 2.25 12.525 1.725C12.225 1.425 11.775 1.425 11.475 1.725C10.95 2.25 8.25 4.875 8.25 6.75C8.25 8.85 9.9 10.5 12 10.5Z"
        fill="currentColor"
      />
      <path
        d="M18.75 21H15.75V12C15.75 11.55 15.45 11.25 15 11.25H12V16.5C12 16.95 11.7 17.25 11.25 17.25C10.8 17.25 10.5 16.95 10.5 16.5V11.25H9C8.55 11.25 8.25 11.55 8.25 12V21H5.25C4.8 21 4.5 21.3 4.5 21.75C4.5 22.2 4.8 22.5 5.25 22.5H9H15H18.75C19.2 22.5 19.5 22.2 19.5 21.75C19.5 21.3 19.2 21 18.75 21Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_15_2"
        x="-4"
        y="0"
        width="32"
        height="32"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_2" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_2" result="shape" />
      </filter>
    </defs>
  </svg>
);

export default memo(Candle);
