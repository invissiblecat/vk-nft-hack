import { replace, useCurrentState } from '@cteamdev/router';
import { Icon20AwardAddOutline, Icon20NewsfeedOutline, Icon20NftHeptagonOutline, Icon20Stars } from '@vkontakte/icons';
import { HorizontalScroll, Tabs, TabsItem } from '@vkontakte/vkui';
import React, { useState } from 'react';

import { Route } from '../../../app/enums';

export const routes = [
  { to: Route.ROOT, label: 'Лента', before: <Icon20NewsfeedOutline /> },
  { to: Route.PURCHASED, label: 'Доступные NFT', before: <Icon20NftHeptagonOutline /> },
  { to: Route.CREATE, label: 'Создать', before: <Icon20AwardAddOutline /> },
  { to: Route.MY, label: 'Моя коллекция', before: <Icon20Stars /> },
];

export const AppNav: React.FC = () => {
  const { path } = useCurrentState();
  const [selected, setSelected] = useState<Route>(path as Route);

  const onClick = (to: Route) => () => {
    if (to !== selected) replace(to);

    setSelected(to);
  };

  return (
    <HorizontalScroll showArrows getScrollToLeft={(i) => i - 120} getScrollToRight={(i) => i + 120}>
      <Tabs mode="secondary">
        {routes.map(({ to, label, before }) => (
          <TabsItem
            before={before}
            key={to}
            selected={selected === to}
            onClick={onClick(to)}
            id={`tab-${to.substring(1)}`}
            aria-controls={`tab-content-${to.substring(1)}`}
          >
            {label}
          </TabsItem>
        ))}
      </Tabs>
    </HorizontalScroll>
  );
};
