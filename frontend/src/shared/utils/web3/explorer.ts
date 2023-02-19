import { ChainId } from '../../../app/enums';

export const EXPLORERS_MAP = {
  [ChainId.UNSET]: {
    url: 'https://testnet.bscscan.com/',
    name: 'Bscscan Testnet',
  },
  [ChainId.BINANCE_TESTNET]: {
    url: 'https://testnet.bscscan.com/',
    name: 'Bscscan Testnet',
  },
};

export const getExplorerLink = (hash: string, chainId = ChainId.BINANCE_TESTNET) =>
  `${EXPLORERS_MAP[chainId].url}tx/${hash}`;

export const getTokenIdLink = (address: string, tokenId: string, chainId = ChainId.BINANCE_TESTNET) =>
  `${EXPLORERS_MAP[chainId].url}token/${address}?a=${tokenId}`;
