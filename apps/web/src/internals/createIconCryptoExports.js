const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const outPathSvg = 'src/assets/svgs/IconCurrency.ts';
const outPathImg = 'src/assets/images/currency.ts';

const result = fs
  .readdirSync(path.join(process.cwd(), 'node_modules/cryptocurrency-icons/svg/icon'))
  .filter((path) => path.endsWith('.svg'));

let contentSvg = `// File nay duoc tao boi src/internals/createIconCryptoExports.js
// Khong tu sua file nay. Chay 'yarn script:createIconCryptoExports' de update.

`;
let contentImg = `// File nay duoc tao boi src/internals/createIconCryptoExports.js
// Khong tu sua file nay. Chay 'yarn script:createIconCryptoExports' de update.

`;
let contentImgBottom = `
  export const currencyImgs: Record<string, string> = { 
`;

for (const fileName of result) {
  const name = fileName.split('.')[0].toUpperCase();
  contentSvg += `export { default as Icon${name} } from 'cryptocurrency-icons/svg/icon/${fileName}';
`;
  contentImg += `import { default as Image${name} } from 'cryptocurrency-icons/svg/icon/${fileName}';
`;
  contentImgBottom += `'${name}': Image${name}.src,`;
}

const extraIcons = {
  KOIN: 'assets/svgs/coins/koin.svg',
  SOL: 'assets/svgs/coins/SOL.svg',
  ADA: 'assets/svgs/coins/ADA.svg',
  ETH: 'assets/svgs/coins/ETH.svg',
  XCR: 'assets/svgs/coins/XCR.png',
  XCRS: 'assets/svgs/coins/XCR.png',
  XCR_BURN: 'assets/svgs/coins/XCR.png',
  RIGHTS: 'assets/svgs/coins/RIGHTS.png',
  LTC: 'assets/svgs/coins/LTC.svg',
  XTZ: 'assets/svgs/coins/XTZ.svg',
  AVAX: 'assets/svgs/coins/AVAX.svg',
  MANA: 'assets/svgs/coins/MANA.svg',
  USD: 'assets/svgs/coins/USD.svg',
  BUSD: 'assets/svgs/coins/BUSD.svg',
  ORBS: 'assets/svgs/coins/ORBS.svg',
  SHIB: 'assets/svgs/coins/SHIB.svg',
  DOGE: 'assets/svgs/coins/DOGE.svg',
  FMT: 'assets/svgs/coins/FMT.svg',
  DOT: 'assets/svgs/coins/DOT.svg',
  IOTX: 'assets/svgs/coins/IOTX.svg',
  NEAR: 'assets/svgs/coins/NEAR.svg',
  LUNC: 'assets/svgs/coins/LUNC.svg',
  LUNA: 'assets/svgs/coins/LUNA.png',
  YGG: 'assets/svgs/coins/YGG.png',
  KP3R: 'assets/svgs/coins/KP3R.svg',
  ETHW: 'assets/svgs/coins/ETHW.png',
  ETHS: 'assets/svgs/coins/ETH.svg',
};

for (const [icon, filePath] of Object.entries(extraIcons)) {
  contentSvg += `export { default as Icon${icon} } from '${filePath}';
`;
  contentImg += `import { default as Image${icon} } from '${filePath}';
`;
  contentImgBottom += `'${icon}': Image${icon}.src,`;
}

contentSvg = prettier.format(contentSvg, { parser: 'babel' });
contentImg += contentImgBottom + '}';
contentImg = prettier.format(contentImg, { parser: 'babel' });

fs.writeFileSync(path.join(process.cwd(), outPathSvg), contentSvg);
fs.writeFileSync(path.join(process.cwd(), outPathImg), contentImg);
