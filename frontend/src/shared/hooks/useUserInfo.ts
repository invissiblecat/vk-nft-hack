/* eslint-disable camelcase */
import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import { useEffect, useState } from 'react';

export const useUserInfo = (user_id?: number) => {
  const [userInfo, setUserInfo] = useState<UserInfo & { screen_name?: string }>();

  const fetchUserInfo = async () => {
    if (!user_id) return;

    try {
      const userInfo = await bridge.send('VKWebAppGetUserInfo', { user_id });
      setUserInfo(userInfo);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user_id]);

  return userInfo;
};
