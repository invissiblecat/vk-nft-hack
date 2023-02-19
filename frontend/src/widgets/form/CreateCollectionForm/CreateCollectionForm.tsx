import { Icon28AddAwardOutline } from '@vkontakte/icons';
import { CellButton, FormItem, FormLayout, Input, Spacing } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';

import { useStores } from '../../../shared';

export const CreateCollectionForm: React.FC = observer(() => {
  const { userStore, snackbarStore, collectionAddressStore } = useStores();
  const [error, setError] = useState({
    collectionName: false,
    collectionSymbol: false,
  });
  const [collectionName, setCollectionName] = useState<string>('');
  const [collectionSymbol, setCollectionSymbol] = useState<string>('');

  const createCollection = () => {
    if (!userStore.data?.id) return snackbarStore.setErrorSnackbar('Пользователь не найден');

    collectionAddressStore.requestCreate({
      vkId: userStore.data?.id,
      // vkId: 1,
      // vkId: 67135042,
      collectionName,
      collectionSymbol,
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
  };

  return (
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
      <Spacing size={20} />
      <CellButton
        style={{ background: 'var(--accent)', color: 'white' }}
        before={<Icon28AddAwardOutline style={{ color: 'white' }} />}
        onClick={onSubmit}
      >
        Создать коллекцию
      </CellButton>
    </FormLayout>
  );
});
