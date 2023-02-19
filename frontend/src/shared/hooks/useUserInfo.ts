/* eslint-disable camelcase */
import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import { useEffect, useState } from 'react';

import { useStores } from './useStores';

export const useUserInfo = (user_id?: number) => {
  const { accessTokenStore } = useStores();
  const [userInfo, setUserInfo] = useState<UserInfo & { screen_name?: string }>();

  const fetchUserInfo = async () => {
    if (!user_id || !accessTokenStore.data) return;

    try {
      const userInfo = await bridge.send('VKWebAppGetUserInfo', { user_id });
      const { response } = await bridge.send('VKWebAppCallAPIMethod', {
        method: 'users.get',
        params: {
          user_ids: `${user_id}`,
          fields: 'screen_name',
          v: '5.131',
          access_token: accessTokenStore.data,
        },
      });
      const [{ screen_name }] = response;
      setUserInfo({ ...userInfo, screen_name });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user_id]);

  return userInfo;
};
