import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal, { IProviderOptions } from 'web3modal';

import { NODES_MAP, SIGNATURE_MESSAGE, switchNetwork } from '../../shared';
import { Connector } from '../enums';
import { apiService } from './api.service';

type EventHandler<T> = (arg0: T) => Promise<void>;
const eventHandler = async () => undefined;

const providerOptions: IProviderOptions = {
  [Connector.WalletConnect]: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        ...NODES_MAP,
      },
    },
  },
};

export const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
  providerOptions,
  theme: 'dark',
});

class WalletService {
  web3ModalProvider?: any;

  provider?: Web3Provider;

  signer?: JsonRpcSigner;

  address = '';

  connectorCache?: Connector;

  isHandlersEnabled?: boolean;

  handleAccountsChanged: EventHandler<{ accounts: string[]; chainId: number }> = eventHandler;

  handleChainChanged: EventHandler<number> = eventHandler;

  handleDisconnect: EventHandler<any | undefined> = eventHandler;

  accountsChangedListener: EventHandler<string[]> = eventHandler;

  chainChangedListener: EventHandler<string> = eventHandler;

  disconnectListener: EventHandler<any | undefined> = eventHandler;

  private async _setupProps() {
    try {
      await switchNetwork();
      this.web3ModalProvider = await web3Modal.connect();
      this.provider = new Web3Provider(this.web3ModalProvider);
      this.signer = this.provider.getSigner();
      this.address = await this.signer!.getAddress();
    } catch (err) {
      console.log('setup err: ', err);
    }
  }

  async connect() {
    this._disableListeners();
    await this._setupProps();
    this._setupListeners();
    this._enableListeners();

    return this.signLoginMessage();
  }

  async disconnect(error?: any) {
    web3Modal.clearCachedProvider();
    if (this.web3ModalProvider && typeof this.web3ModalProvider.disconnect === 'function') {
      await this.web3ModalProvider.disconnect();
    }

    apiService.removeAuthHeader();
    await this.handleDisconnect(error);
  }

  async signLoginMessage() {
    try {
      if (!this.signer) return;

      const signature = await this.signer.signMessage(SIGNATURE_MESSAGE);

      apiService.setAuthHeader(signature);

      return this.address;
    } catch (err) {
      console.log('login error: ', err);
      this.disconnect();
    }
  }

  private _enableListeners() {
    if (!this.web3ModalProvider) return;

    if (this.web3ModalProvider.once) {
      this.web3ModalProvider.once('chainChanged', this.chainChangedListener);
    }

    if (this.isHandlersEnabled && this.connectorCache !== Connector.WalletConnect) {
      return;
    }

    if (this.web3ModalProvider.on) {
      this.web3ModalProvider.on('accountsChanged', this.accountsChangedListener);

      this.isHandlersEnabled = true;
    }
  }

  private _disableListeners() {
    if (!this.web3ModalProvider || !this.web3ModalProvider.off) return;

    this.web3ModalProvider.off('accountsChanged', this.accountsChangedListener);
    this.web3ModalProvider.off('chainChanged', this.chainChangedListener);
  }

  initListeners(
    handleAccountsChanged: EventHandler<{ accounts: string[]; chainId: number }>,
    handleChainChanged: EventHandler<number>,
    handleDisconnect: EventHandler<any>,
  ) {
    this.handleAccountsChanged = handleAccountsChanged;
    this.handleChainChanged = handleChainChanged;
    this.handleDisconnect = handleDisconnect;
  }

  private _setupListeners() {
    this.accountsChangedListener = async () => {
      this.disconnect();
    };

    this.chainChangedListener = async () => {
      this.disconnect();
    };
  }
}

export const walletService = new WalletService();
