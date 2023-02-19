import { ChainId } from '../../../app/enums';
import { setupNetwork } from './setup-network';

export const switchNetwork = async () => {
  let error: string | null = null;
  if (!window.ethereum) {
    console.error("Can't setup the network on metamask because window.ethereum is undefined");
    error = "Can't setup the network on metamask because window.ethereum is undefined";
    return error;
  }

  try {
    error = await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${ChainId.BINANCE_TESTNET.toString(16)}` }],
    });
  } catch (switchError: any) {
    error = JSON.stringify(switchError);
    console.error('Failed to switch the network:', switchError);

    if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
      error = await setupNetwork();
    }
  }

  return error;
};
