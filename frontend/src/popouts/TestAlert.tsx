import { back } from '@cteamdev/router';
import { Alert } from '@vkontakte/vkui';
import React from 'react';

import { PopoutProps } from '../types';

export const TestAlert: React.FC<PopoutProps> = () => {
  return (
    <Alert
      actions={[{
        title: 'Круто!',
        mode: 'destructive',
        autoclose: true,
      }, {
        title: 'Отмена',
        mode: 'cancel',
        autoclose: true,
      }]}
      onClose={back}
      header="Тестовый алерт"
      text="Это тестовый алерт!"
      actionsLayout="vertical"
    />
  );
};
