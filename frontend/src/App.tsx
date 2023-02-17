import '@vkontakte/vkui/dist/vkui.css';

import { View } from '@cteamdev/router';
import React, { useEffect } from 'react';

import { Route } from './app/enums';
import { Providers } from './app/providers';
import { Private } from './features';
import { CreatePage, Home, Info, Persik } from './pages';
import { useStores } from './shared';
import { Layout, Navigation } from './widgets';

export const App: React.FC = () => {
  const { userStore } = useStores();

  useEffect(() => {
    userStore.activate();
  }, [userStore]);

  return (
    <Providers>
      <Navigation>
        <View nav={Route.ROOT}>
          <Layout nav={Route.ROOT}>
            <Home />
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
