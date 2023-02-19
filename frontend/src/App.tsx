import '@vkontakte/vkui/dist/vkui.css';

import { back, View } from '@cteamdev/router';
import { Icon20Cancel } from '@vkontakte/icons';
import { Panel, PanelHeader, PanelHeaderButton } from '@vkontakte/vkui';
import React, { useEffect } from 'react';

import { Route } from './app/enums';
import { Providers } from './app/providers';
import { walletService } from './app/services';
import { Private } from './features';
import { AvailablePage, CreatePage, FeedPage, MyCollectionPage, NftPage } from './pages';
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
          <Panel nav={Route.NFT}>
            <PanelHeader before={
              <PanelHeaderButton onClick={back}>
                <Icon20Cancel />
              </PanelHeaderButton>
            }
            />
            <Private>
              <NftPage />
            </Private>
          </Panel>
        </View>
        <View nav={Route.PURCHASED}>
          <Layout nav={Route.ROOT}>
            <Private>
              <AvailablePage />
            </Private>
          </Layout>
        </View>
        <View nav={Route.CREATE}>
          <Layout nav={Route.ROOT}>
            <Private>
              <CreatePage />
            </Private>
          </Layout>
        </View>
        <View nav={Route.MY}>
          <Layout nav={Route.ROOT}>
            <Private>
              <MyCollectionPage />
            </Private>
          </Layout>
        </View>
      </Navigation>
    </Providers>
  );
};
