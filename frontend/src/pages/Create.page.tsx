import { Icon28AddAwardOutline, Icon28FavoriteAddOutline } from '@vkontakte/icons';
import { CellButton, Group, SimpleCell } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import { ChainId, ModalRoute, Route } from '../app/enums';
import { Loader } from '../features';
import { CONTENT_ROOT_ADDRESSES_MAP, openModalCallback, useStores } from '../shared';

export const CreatePage: React.FC = observer(() => {
  const { collectionStore, userStore, snackbarStore } = useStores();

  const createCollection = () => {
    if (!userStore.data?.id) return snackbarStore.setErrorSnackbar('Пользователь не найден');

    collectionStore.requestCreate({
      address: CONTENT_ROOT_ADDRESSES_MAP[ChainId.BINANCE_TESTNET],
      collection: { vkId: userStore.data.id, collectionName: 'testName', collectionSymbol: 'testSymbol' },
    });
  };

  useEffect(() => {
    if (!userStore.data) return;

    collectionStore.activate({
      address: CONTENT_ROOT_ADDRESSES_MAP[ChainId.BINANCE_TESTNET],
      vkId: userStore.data.id,
    });

    return () => collectionStore.deactivate();
  }, [collectionStore, userStore.data]);

  return (
    <>
      <Group>
        <SimpleCell style={{ pointerEvents: 'none' }}>
          Тут вы можете создать приватный контент
        </SimpleCell>
        <Loader isLoading={collectionStore.isLoading}>
          {collectionStore.data ? (
            <CellButton before={<Icon28FavoriteAddOutline />} onClick={createCollection}>
              Создать приватный контент
            </CellButton>
          ) : (
            <CellButton
              before={<Icon28AddAwardOutline />}
              onClick={openModalCallback(Route.CREATE, ModalRoute.CREATE_COLLECTION)}
            >
              Создать коллекцию
            </CellButton>
          )}
        </Loader>
      </Group>
    </>
  );
});
