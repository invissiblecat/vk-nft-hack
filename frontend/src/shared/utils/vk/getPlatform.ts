import { Platform, PlatformType } from '@vkontakte/vkui';

import { getHashParam } from '../query/getHashParam';

const platforms: Record<string, PlatformType> = {
  iphone: Platform.IOS,
  mobile_web: Platform.IOS,
  android: Platform.ANDROID,
  desktop_web: Platform.VKCOM,
};

export const getPlatform = (): PlatformType => {
  const rawPlatform: string | null = getHashParam('vk_platform');

  return platforms[rawPlatform || 'desktop_web'];
};
