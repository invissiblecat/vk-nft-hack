import { PanelSpinner, SpinnerProps } from '@vkontakte/vkui';
import React from 'react';

interface LoaderProps {
  isLoading?: boolean;
  size?: SpinnerProps['size']
}

export const Loader: React.FC<LoaderProps> = ({ isLoading, size = 'medium', children }) => {
  return (
    <>
      {isLoading ? (
        <PanelSpinner size={size} style={{ margin: '20px 0' }} />
      ) : (
        children
      )}
    </>
  );
};
