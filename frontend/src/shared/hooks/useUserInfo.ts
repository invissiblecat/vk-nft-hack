import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import { useEffect, useState } from 'react';

export const useUserInfo = (user_id?: number) => {
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const fetchUserInfo = async () => {
    if (!user_id) return;

    const userInfo = await bridge.send('VKWebAppGetUserInfo', { user_id });
    setUserInfo(userInfo);
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user_id]);

  return userInfo;
};
