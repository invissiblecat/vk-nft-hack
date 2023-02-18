import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import { useComputedMemo, useStores } from '../../../shared';
import { ApplicationListApproved } from '../ApplicationListApproved';
import { ApplicationListDeclined } from '../ApplicationListDeclined';

export const ApplicationList: React.FC = observer(() => {
  const { applicationListStore, contentStore } = useStores();

  const { approvedAddresses, declinedAddresses } = useComputedMemo(() => {
    if (!applicationListStore.data) return { approvedAddresses: [], declinedAddresses: [] };

    return applicationListStore.data.reduce<{ approvedAddresses: string[], declinedAddresses: string[] }>(
      (result, { user, isAccepted: isAcepted }) => {
        if (isAcepted) {
          result.approvedAddresses.push(user.address);
        } else {
          result.declinedAddresses.push(user.address);
        }

        return result;
      }, { approvedAddresses: [], declinedAddresses: [] });
  }, [applicationListStore.data]);

  useEffect(() => {
    if (!contentStore.data) return;

    applicationListStore.activate(contentStore.data._id);

    return () => applicationListStore.deactivate();
  }, [contentStore.data]);

  return (
    <>
      <ApplicationListDeclined declinedAddresses={declinedAddresses} />
      <ApplicationListApproved approvedAddresses={approvedAddresses} />
    </>

  );
});
