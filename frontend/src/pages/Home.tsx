import { push } from '@cteamdev/router';
import {
  Icon28ArticleOutline,
  Icon28BillheadOutline,
  Icon28CancelCircleOutline,
  Icon28CheckCircleOutline,
  Icon28ChevronRightOutline,
  Icon28PawOutline,
  Icon28WarningTriangleOutline } from '@vkontakte/icons';
import { Avatar, Group, SimpleCell } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { useStores } from '../shared';

export const Home: React.FC = observer(() => {
  const { snackbarStore, userStore, walletStore } = useStores();

  return (
    <>
      <Group>
        <SimpleCell
          before={
            <Avatar size={72} src={userStore.data?.photo_200} />
          }
          description="Это же ты!"
        >
          {userStore.data?.first_name} {userStore.data?.last_name}
        </SimpleCell>
      </Group>
      <Group>
        <SimpleCell
          before={<Icon28PawOutline />}
          after={<Icon28ChevronRightOutline />}
          onClick={() => push('/persik')}
        >
          Покажи Персика!
        </SimpleCell>
      </Group>
      <Group>
        <SimpleCell
          before={<Icon28BillheadOutline />}
          onClick={() => push('/?modal=modal')}
        >
          Покажи модальную карточку
        </SimpleCell>
      </Group>
      <Group>
        <SimpleCell
          before={<Icon28WarningTriangleOutline />}
          onClick={() => push('/?popout=alert')}
        >
          Покажи алерт
        </SimpleCell>
        <SimpleCell
          id="ShowAlert"
          before={<Icon28ArticleOutline />}
          onClick={() => push('/?popout=action-sheet')}
        >
          Покажи список опций
        </SimpleCell>
      </Group>
      <Group>
        <SimpleCell
          before={<Icon28CheckCircleOutline />}
          onClick={() => snackbarStore.setSuccessSnackbar('Это добрый снекбар')}
        >
          Покажи добрый снекбар
        </SimpleCell>
        <SimpleCell
          before={<Icon28CancelCircleOutline />}
          onClick={() => snackbarStore.setErrorSnackbar('Это злой снекбар')}
        >
          Покажи злой снекбар
        </SimpleCell>
      </Group>
      <Group>
        {walletStore.data ? (
          <SimpleCell
            onClick={() => walletStore.deactivate()}
          >
            Отключить
          </SimpleCell>
        ) : (
          <SimpleCell
            onClick={() => walletStore.activate()}
          >
            Подключить
          </SimpleCell>
        )}
      </Group>
    </>
  );
});
