import { Icon28FavoriteAddOutline } from '@vkontakte/icons';
import { CellButton, FormItem, FormLayout, Input, Spacing, Spinner, Textarea } from '@vkontakte/vkui';
import { constants } from 'ethers';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';

import { IconUpload } from '../../../features';
import { useStores } from '../../../shared';

export const CreateContentForm: React.FC = observer(() => {
  const { userStore, snackbarStore, contentStore, collectionAddressStore } = useStores();
  const [whitelistPlaces, setWhitelistPlaces] = useState<number>();
  const [tokenDescription, setTokenDescription] = useState('');
  const [link, setLink] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [file, setFile] = useState<Blob & { preview?: string }>();
  const [error, setError] = useState({
    title: false,
  });
  const reset = () => {
    setWhitelistPlaces(undefined);
    setTokenDescription('');
    setLink('');
    setTitle('');
    setText('');
    setFile(undefined);
  };

  const createContent = () => {
    if (!userStore.data?.id) return snackbarStore.setErrorSnackbar('Пользователь не найден');
    if (!collectionAddressStore.data) return snackbarStore.setErrorSnackbar('Коллекция не найдена');
    if (!title) return setError({ title: !title });

    contentStore.requestCreate({
      address: collectionAddressStore.data,
      whitelistPlaces: (whitelistPlaces || constants.MaxUint256).toString(),
      initialWhitelistMembers: [],
      collectionAddress: collectionAddressStore.data,
      ownerId: userStore.data?.id,
      // ownerId: 1,
      // ownerId: 67135042,
      tokenDescription,
      link,
      text,
      file,
      title,
    });
  };

  const onSubmit = () => {
    createContent();
  };

  useEffect(() => {
    if (!contentStore.isLoading) return;

    return () => reset();
  }, [contentStore.isLoading]);

  return (
    <FormLayout onSubmit={onSubmit}>
      <FormItem top="Картинка">
        <IconUpload file={file} onChange={setFile} disabled={contentStore.isLoading} />
      </FormItem>
      <FormItem top="Максимум пользователей" bottom="Оставьте поле пустым, если количество пользователей неограничено">
        <Input
          disabled={contentStore.isLoading}
          type="number"
          value={whitelistPlaces}
          onChange={({ target }) => setWhitelistPlaces(+target.value)}
        />
      </FormItem>
      <FormItem top="Заголовок" status={error.title ? 'error' : 'default'}>
        <Textarea
          disabled={contentStore.isLoading}
          value={title}
          onChange={({ target }) => {
            setTitle(target.value);
            setError({ title: false });
          }}
        />
      </FormItem>
      <FormItem top="Краткое Описание" bottom="Доступно всем пользователям">
        <Textarea
          disabled={contentStore.isLoading}
          value={tokenDescription}
          onChange={({ target }) => setTokenDescription(target.value)}
        />
      </FormItem>
      <FormItem top="Полное Описание" bottom="Доступно ограниченному количеству пользователей">
        <Textarea
          disabled={contentStore.isLoading}
          value={text}
          onChange={({ target }) => setText(target.value)}
        />
      </FormItem>
      <FormItem top="Ссылка">
        <Input
          disabled={contentStore.isLoading}
          value={link}
          onChange={({ target }) => setLink(target.value)}
        />
      </FormItem>
      <Spacing size={20} />
      <CellButton
        centered
        style={{ background: 'var(--accent)', color: 'white' }}
        disabled={contentStore.isLoading}
        before={contentStore.isLoading ? (
          <Spinner style={{ width: 30, padding: '10px 8px 10px 0' }} />
        ) : (
          <Icon28FavoriteAddOutline style={{ color: 'white' }} />
        )}
        onClick={onSubmit}
      >
        {contentStore.isLoading ? 'Загрузка...' : 'Создать NFT'}
      </CellButton>
    </FormLayout>
  );
});
