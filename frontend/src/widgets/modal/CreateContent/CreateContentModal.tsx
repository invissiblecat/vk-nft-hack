import { back } from '@cteamdev/router';
import { Icon16Clear } from '@vkontakte/icons';
import { Button, ChipsInput, FormItem, FormLayout, IconButton, Input, ModalCard, ModalPageProps, Textarea } from '@vkontakte/vkui';
import { ChipOption } from '@vkontakte/vkui/dist/components/Chip/Chip';
import { constants } from 'ethers';
import { observer } from 'mobx-react-lite';
import React, { MouseEventHandler, useState } from 'react';

import { IconUpload } from '../../../features';
import { useStores } from '../../../shared';

export const CreateContentModal: React.FC<Pick<ModalPageProps, 'nav'>> = observer(({ nav }) => {
  const { /* userStore, */ snackbarStore, contentStore, collectionStore } = useStores();
  const [whitelistPlaces, setWhitelistPlaces] = useState<number>();
  const [addresses, setAddresses] = useState<ChipOption[]>([]);
  const [tokenDescription, setTokenDescription] = useState('');
  const [link, setLink] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [file, setFile] = useState<Blob & { preview?: string }>();

  const clearAddresses: MouseEventHandler = (e) => {
    e.stopPropagation();
    setAddresses([]);
  };

  const createContent = () => {
    // if (!userStore.data?.id) return snackbarStore.setErrorSnackbar('Пользователь не найден');
    if (!collectionStore.data) return snackbarStore.setErrorSnackbar('Коллекция не найдена');

    contentStore.requestCreate({
      address: collectionStore.data,
      whitelistPlaces: (whitelistPlaces || constants.MaxUint256).toString(),
      initialWhitelistMembers: addresses.map(({ value }) => value?.toString()).filter(Boolean) as string[],
      collectionAddress: collectionStore.data,
      // ownerId: userStore.data?.id,
      ownerId: 67135042,
      tokenDescription,
      link,
      text,
      file,
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
      <FormLayout onSubmit={onSubmit} style={{ overflow: 'auto' }}>
        <FormItem top="Картинка">
          <IconUpload file={file} onChange={setFile} />
        </FormItem>
        <FormItem top="Максимум пользователей" bottom="Оставьте пустым, если колличество пользователей неограничено">
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
            after={addresses.length && (
              <IconButton hoverMode="opacity" aria-label="Очистить поле" onClick={clearAddresses}>
                <Icon16Clear />
              </IconButton>
            )}
          />
        </FormItem>
        <FormItem top="Заголовок">
          <Textarea
            value={title}
            onChange={({ target }) => setTitle(target.value)}
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
