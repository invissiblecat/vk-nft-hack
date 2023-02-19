import { Icon20CancelCircleFillRed, Icon20CheckCircleFillGreen } from '@vkontakte/icons';
import { Snackbar as SnackbarVKUI, SnackbarProps as SnackbarPropsVKUI } from '@vkontakte/vkui';
import { observer } from 'mobx-react-lite';
import React, { CSSProperties, useMemo } from 'react';

import { SnackbarType } from '../../app/enums';
import { useComputedMemo, useStores } from '../../shared';

interface SnackbarProps extends Omit<SnackbarPropsVKUI, 'onClose' | 'before' | 'children'> {
  isDesktop: boolean
}

export const Snackbar: React.FC<SnackbarProps> = observer(({ isDesktop, ...props }) => {
  const { snackbarStore } = useStores();

  const icon = useComputedMemo(() => {
    switch (snackbarStore.shackbar?.type) {
      case SnackbarType.ERROR:
        return <Icon20CancelCircleFillRed width={24} height={24} />;

      default:
        return <Icon20CheckCircleFillGreen width={24} height={24} />;
    }
  }, []);

  const style = useMemo<CSSProperties | undefined>(() => {
    if (isDesktop) return;

    return { marginBottom: 'calc(var(--tabbar_height) + var(--safe-area-inset-bottom))' };
  }, [isDesktop]);

  if (!snackbarStore.shackbar) return null;

  return (
    <SnackbarVKUI
      onClose={() => snackbarStore.setSnackbar()}
      before={icon}
      style={{ ...style, ...props.style }}
      {...props}
    >
      {snackbarStore.shackbar?.text}
    </SnackbarVKUI>
  );
});
