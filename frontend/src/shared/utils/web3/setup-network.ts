import { ChainId } from '../../../app/enums';

const chainData = {
  name: 'BSC Testnet',
  short_name: 'bsc',
  chain: 'smartchain',
  network: 'testnet',
  chain_id: 97,
  network_id: 97,
  rpc_url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  native_currency: {
    symbol: 'BNB',
    name: 'BNB',
    decimals: 18,
  },
  block_explorer_urls: ['https://testnet.bscscan.com/'],
};

export const setupNetwork = async () => {
  let error: string | null = null;

  try {
    error = await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${ChainId.BINANCE_TESTNET.toString(16)}`,
          chainName: chainData.name,
          nativeCurrency: chainData.native_currency,
          rpcUrls: [chainData.rpc_url],
          blockExplorerUrls: chainData.block_explorer_urls,
        },
      ],
    });
  } catch (addError: any) {
    console.error('Failed to setup the network:', addError);
    error = JSON.stringify(addError);
  }

  return error;
};
