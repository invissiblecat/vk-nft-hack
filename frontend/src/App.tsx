import '@vkontakte/vkui/dist/vkui.css';

import { View } from '@cteamdev/router';
import React, { useEffect } from 'react';

import { Route } from './app/enums';
import { Providers } from './app/providers';
import { walletService } from './app/services';
import { Private } from './features';
import { CreatePage, FeedPage, Info, Persik, PurchasedPage } from './pages';
import { switchNetwork, useStores } from './shared';
import { Layout, Navigation } from './widgets';

export const App: React.FC = () => {
  const { userStore, walletStore } = useStores();

  useEffect(() => {
    userStore.activate();
  }, [userStore]);

  const handleAccountsChanged = async () => {
    walletStore.deactivate();
  };
  const handleChainChanged = async () => {
    switchNetwork();
  };

  useEffect(() => {
    walletService.initListeners(
      handleAccountsChanged,
      handleChainChanged,
    );
  }, []);

  return (
    <Providers>
      <Navigation>
        <View nav={Route.ROOT}>
          <Layout nav={Route.ROOT}>
            <Private>
              <FeedPage />
            </Private>
          </Layout>
          <Persik nav="/persik" />
        </View>
        <View nav={Route.PURCHASED}>
          <Layout nav={Route.ROOT}>
            <Private>
              <PurchasedPage />
            </Private>
          </Layout>
          <Persik nav="/persik" />
        </View>
        <View nav={Route.CREATE}>
          <Layout nav={Route.ROOT}>
            <Private>
              <CreatePage />
            </Private>
          </Layout>
          <Persik nav="/persik" />
        </View>
        <View nav={Route.MY}>
          <Layout nav={Route.ROOT}>
            <Info />
          </Layout>
        </View>
      </Navigation>
    </Providers>
  );
};
