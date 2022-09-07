import { isProd } from 'utils/constant';

export const getScanAddress = (chain?: string, txid?: any) => {
  if (isProd) {
    switch (chain) {
      case 'ada':
        return `https://explorer.cardano.org/en/transaction?id=${txid}`;
      case 'bsc':
        return `https://bscscan.com/tx/${txid}`;
      case 'btc':
        return `https://www.blockchain.com/btc/tx/${txid}`;
      case 'eth':
        return `https://etherscan.io/tx/${txid}`;
      case 'polygon':
        return `https://polygonscan.com/tx/${txid}`;
      case 'sol':
        return `https://solscan.io/tx/${txid}`;
      case 'xrp':
        return `https://xrpscan.com/tx/${txid}`;
      case 'ltc':
        return `https://blockchair.com/litecoin/transaction/${txid}`;
      case 'bch':
        return `https://blockchair.com/bitcoin-cash/transaction/${txid}`;
      case 'xtz':
        return `https://tezblock.io/transaction/${txid}`;
      case 'xlm':
        return `https://blockchair.com/stellar/transaction/${txid}`;
      case 'iost':
        return `https://explorer.iost.io/tx/${txid}`;
      case 'avax':
        return `https://snowtrace.io/tx/${txid}`;
      case 'tron':
        return `https://tronscan.org/#/transaction/${txid}`;
      case 'cosmos':
        return `https://atomscan.com/transactions/${txid}`;
      case 'doge':
        return `https://dogechain.info/tx/${txid}`;
      case 'ftm':
        return `https://ftmscan.com/tx/${txid}`;
      case 'polkadot':
        return `https://polkadot.subscan.io/extrinsic/${txid}`;
      case 'iotex':
        return `https://iotexscan.io/tx/${txid}`;
      case 'avax-xchain':
        return `https://avascan.info/blockchain/x/tx/${txid}`;
      case 'terra':
        return `https://finder.terra.money/mainnet/tx/${txid}`;
      case 'terra-classic':
        return `https://finder.terra.money/classic/tx/${txid}`;
      default:
        return '';
    }
  }

  switch (chain) {
    case 'ada':
      return `https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=${txid}`;
    case 'bsc':
      return ` https://testnet.bscscan.com/tx/${txid}`;
    case 'btc':
      return `https://www.blockchain.com/btc-testnet/tx/${txid}`;
    case 'eth':
      return `https://rinkeby.etherscan.io/tx/${txid}`;
    case 'polygon':
      return `https://mumbai.polygonscan.com/tx/${txid}`;
    case 'sol':
      return `https://solscan.io/tx/${txid}?cluster=testnet`;
    case 'xrp':
      return `https://testnet.xrpl.org/transactions/${txid}`;
    case 'ltc':
      return `https://blockexplorer.one/litecoin/testnet/tx/${txid}`;
    case 'bch':
      return `https://blockchair.com/bitcoin-cash/transaction/${txid}`;
    case 'xtz':
      return `https://hangzhou2net.tzkt.io/${txid}`;
    case 'xlm':
      return `https://blockchair.com/stellar/transaction/${txid}`;
    case 'iost':
      return `https://testnet.explorer.iost.io/tx/${txid}`;
    case 'avax':
      return `https://testnet.snowtrace.io/tx/${txid}`;
    case 'tron':
      return `https://tronscan.org/#/transaction/${txid}`;
    case 'cosmos':
      return `https://atomscan.com/transactions/${txid}`;
    case 'doge':
      return `https://dogechain.info/tx/${txid}`;
    case 'ftm':
      return `https://ftmscan.com/tx/${txid}`;
    case 'polkadot':
      return `https://polkadot.subscan.io/extrinsic/${txid}`;
    case 'iotex':
      return `https://iotexscan.io/tx/${txid}`;
    case 'avax-xchain':
      return `https://avascan.info/blockchain/x/tx/${txid}`;
    case 'terra':
      return `https://finder.terra.money/mainnet/tx/${txid}`;
    case 'terra-classic':
      return `https://finder.terra.money/classic/tx/${txid}`;
    default:
      return '';
  }
};
