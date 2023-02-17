import { ModalRoot as ModalRootRouter } from '@cteamdev/router';
import React from 'react';

import { ModalRoute } from '../../../app/enums';
import { CreateCollectionModal } from '../CreateCollection';

export const ModalRoot: React.FC = () => {
  return (
    <ModalRootRouter>
      <CreateCollectionModal nav={ModalRoute.CREATE_COLLECTION} />
    </ModalRootRouter>
  );
};
