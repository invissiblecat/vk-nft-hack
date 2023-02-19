import { Icon56Stars3Outline } from '@vkontakte/icons';
import { Placeholder } from '@vkontakte/vkui';
import React, { ReactNode } from 'react';

interface EmptyPageProps {
  action?: ReactNode
  isEmpty?: boolean
}

export const EmptyPage: React.FC<EmptyPageProps> = ({ action, isEmpty, children }) => {
  return (
    <>
      {isEmpty ? (
        <Placeholder
          icon={<Icon56Stars3Outline />}
          action={action}
        >
          Здесь пока ничего нет
        </Placeholder>
      ) : (
        children
      )
      }
    </>
  );
};
