import { PopoutRoot } from '@cteamdev/router';
import React from 'react';

import { TestActionSheet } from './TestActionSheet';
import { TestAlert } from './TestAlert';

export const Popouts = () => {
  return (
    <PopoutRoot>
      <TestAlert nav="alert" />
      <TestActionSheet nav="action-sheet" />
    </PopoutRoot>
  );
};
