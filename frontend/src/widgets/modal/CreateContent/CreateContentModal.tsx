import { back } from '@cteamdev/router';
import { Icon16Clear } from '@vkontakte/icons';
import { Button, ChipsInput, FormItem, FormLayout, IconButton, Input, ModalCard, ModalPageProps, Textarea } from '@vkontakte/vkui';
import { ChipOption } from '@vkontakte/vkui/dist/components/Chip/Chip';
import { constants } from 'ethers';
import { observer } from 'mobx-react-lite';
import React, { MouseEventHandler, useState } from 'react';

import { useStores } from '../../../shared';

export const CreateContentModal: React.FC<Pick<ModalPageProps, 'nav'>> = observer(({ nav }) => {
  const { userStore, snackbarStore, contentStore, collectionStore } = useStores();
  const [whitelistPlaces, setWhitelistPlaces] = useState(0);
  const [addresses, setAddresses] = useState<ChipOption[]>([]);
  const [tokenDescription, setTokenDescription] = useState('');
  const [link, setLink] = useState<string>('');
  const [text, setText] = useState<string>('');

  const clearAddresses: MouseEventHandler = (e) => {
    e.stopPropagation();
    setAddresses([]);
  };

  const createContent = () => {
    if (!userStore.data?.id) return snackbarStore.setErrorSnackbar('Пользователь не найден');
    if (!collectionStore.data) return snackbarStore.setErrorSnackbar('Коллекция не найдена');

    contentStore.requestCreate({
      whitelistPlaces: (whitelistPlaces || constants.MaxUint256).toString(),
      initialWhitelistMembers: addresses.map(({ value }) => value?.toString()).filter(Boolean) as string[],
      collectionAddress: collectionStore.data,
      ownerId: userStore.data?.id,
      // ownerId: 67135042,
      tokenDescription,
      link,
      text,
    });
  };

  const onSubmit = () => {
    createContent();
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
      header="Создание NFT"
    >
      <FormLayout onSubmit={onSubmit}>
        <FormItem top="Максимум пользователей">
          <Input
            type="number"
            value={whitelistPlaces}
            onChange={({ target }) => setWhitelistPlaces(+target.value)}
          />
        </FormItem>
        <FormItem top="Адреса пользователей">
          <ChipsInput
            onChange={setAddresses}
            value={addresses}
            after={
              <IconButton hoverMode="opacity" aria-label="Очистить поле" onClick={clearAddresses}>
                <Icon16Clear />
              </IconButton>
              }
          />
        </FormItem>
        <FormItem top="Краткое Описание">
          <Textarea
            value={tokenDescription}
            onChange={({ target }) => setTokenDescription(target.value)}
          />
        </FormItem>
        <FormItem top="Полное Описание">
          <Textarea
            value={text}
            onChange={({ target }) => setText(target.value)}
          />
        </FormItem>
        <FormItem top="Ссылка">
          <Input
            value={link}
            onChange={({ target }) => setLink(target.value)}
          />
        </FormItem>
      </FormLayout>
    </ModalCard>
  );
});
