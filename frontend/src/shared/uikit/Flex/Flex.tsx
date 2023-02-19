import React, { CSSProperties } from 'react';

interface FlexProps {
  gap?: CSSProperties['gap']
  alignItems?: CSSProperties['alignItems']
  justifyContent?: CSSProperties['justifyContent']
  flexDirection?: CSSProperties['flexDirection']
  flexWrap?: CSSProperties['flexWrap'],
  w100?: boolean,
  h100?: boolean,
}

export const Flex: React.FC<FlexProps> = ({ children, w100, h100, alignItems = 'center', ...props }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems,
      ...props,
      width: w100 ? '100%' : undefined,
      height: h100 ? '100%' : undefined,
    }}
    >
      {children}
    </div>
  );
};
