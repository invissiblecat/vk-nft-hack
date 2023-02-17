import { ModalRoot as ModalRootRouter } from '@cteamdev/router';
import React from 'react';

import { ModalRoute } from '../../../app/enums';
import { CreateCollectionModal } from '../CreateCollection';
import { CreateContentModal } from '../CreateContent';

export const ModalRoot: React.FC = () => {
  return (
    <ModalRootRouter>
      <CreateCollectionModal nav={ModalRoute.CREATE_COLLECTION} />
      <CreateContentModal nav={ModalRoute.CREATE_CONTENT} />
    </ModalRootRouter>
  );
};
