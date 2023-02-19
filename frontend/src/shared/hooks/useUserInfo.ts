/* eslint-disable camelcase */
import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import { useEffect, useState } from 'react';

export const useUserInfo = (user_id?: number) => {
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const fetchUserInfo = async () => {
    if (!user_id) return;

    const userInfo = await bridge.send('VKWebAppGetUserInfo', { user_id });
    const { access_token } = await bridge.send('VKWebAppGetAuthToken', {
      app_id: 51557564,
      scope: 'friends,status',
    });
    const res = bridge.send('VKWebAppCallAPIMethod', {
      method: 'users.get',
      params: {
        user_ids: `${user_id}`,
        fields: 'screen_name',
        v: '5.131',
        access_token,
      },
    });
    console.log(res);
    setUserInfo(userInfo);
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user_id]);

  return userInfo;
};
