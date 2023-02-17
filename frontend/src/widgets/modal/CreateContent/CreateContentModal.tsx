import { back } from '@cteamdev/router';
import { Button, FormItem, FormLayout, Input, ModalCard, ModalPageProps } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';

import { ChainId } from '../../../app/enums';
import { CONTENT_ROOT_ADDRESSES_MAP, useStores } from '../../../shared';

export const CreateCollectionModal: React.FC<Pick<ModalPageProps, 'nav'>> = observer(({ nav }) => {
  const { userStore, snackbarStore, collectionStore } = useStores();
  const [error, setError] = useState({
    collectionName: false,
    collectionSymbol: false,
  });
  const [collectionName, setCollectionName] = useState<string>('');
  const [collectionSymbol, setCollectionSymbol] = useState<string>('');

  const createCollection = () => {
    if (!userStore.data?.id) return snackbarStore.setErrorSnackbar('Пользователь не найден');

    collectionStore.requestCreate({
      address: CONTENT_ROOT_ADDRESSES_MAP[ChainId.BINANCE_TESTNET],
      collection: { vkId: userStore.data.id, collectionName, collectionSymbol },
    });
  };

  const onSubmit = () => {
    if (!collectionName || !collectionSymbol) {
      return setError({
        collectionName: !collectionName,
        collectionSymbol: !collectionSymbol,
      });
    }

    createCollection();
    back();
  };

  return (
    <ModalCard
      nav={nav}
      onClose={back}
      actions={
        <Button size="l" mode="primary" onClick={onSubmit}>
          Создать
        </Button>
      }
      header="Создание коллекции"
    >

      <FormLayout onSubmit={onSubmit}>
        <FormItem top="Название" status={error.collectionName ? 'error' : 'default'}>
          <Input
            value={collectionName}
            onChange={({ target }) => {
              setCollectionName(target.value);
              setError((state) => ({ ...state, collectionName: false }));
            }
            }
          />
        </FormItem>
        <FormItem top="Символ" status={error.collectionSymbol ? 'error' : 'default'}>
          <Input
            value={collectionSymbol}
            onChange={({ target }) => {
              setCollectionSymbol(target.value);
              setError((state) => ({ ...state, collectionSymbol: false }));
            }}
          />
        </FormItem>
      </FormLayout>
    </ModalCard>
  );
});
