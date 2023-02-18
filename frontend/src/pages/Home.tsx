import { push } from '@cteamdev/router';
import {
  Icon28ChevronRightOutline,
  Icon28PawOutline } from '@vkontakte/icons';
import { Group, SimpleCell } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React from 'react';

export const Home: React.FC = observer(() => {
  return (
    <>
      {/* <Group>
        <SimpleCell
          before={
            <Avatar size={72} src={userStore.data?.photo_200} />
          }
          description="Это же ты!"
        >
          {userStore.data?.first_name} {userStore.data?.last_name}
        </SimpleCell>
      </Group> */}
      <Group>
        <SimpleCell
          before={<Icon28PawOutline />}
          after={<Icon28ChevronRightOutline />}
          onClick={() => push('/persik')}
        >
          Покажи Персика!
        </SimpleCell>
      </Group>
      {/* <Group>
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
      </Group> */}
    </>
  );
});
