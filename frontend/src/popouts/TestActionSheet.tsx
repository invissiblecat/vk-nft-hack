import { back } from '@cteamdev/router';
import { ActionSheet, ActionSheetItem } from '@vkontakte/vkui';
import React, { Ref, useRef } from 'react';

import { PopoutProps } from '../types';

export const TestActionSheet: React.FC<PopoutProps> = () => {
  const ref: Ref<HTMLElement> = useRef<HTMLElement>(document.getElementById('ShowAlert'));

  return (
    <ActionSheet
      onClose={back}
      iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
      toggleRef={ref}
    >
      <ActionSheetItem autoclose>
        Это первая опция
      </ActionSheetItem>
      <ActionSheetItem autoclose>
        Это вторая опция
      </ActionSheetItem>
    </ActionSheet>
  );
};
