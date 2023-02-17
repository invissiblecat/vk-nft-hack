import { replace, useCurrentState } from '@cteamdev/router';
import { HorizontalScroll, Tabs, TabsItem } from '@vkontakte/vkui';
import React, { useState } from 'react';

import { Route } from '../../../app/enums';

export const routes = [
  { to: Route.ROOT, label: 'Лента' },
  { to: Route.PURCHASED, label: 'Купленные' },
  { to: Route.CREATE, label: 'Создать' },
  { to: Route.MY, label: 'Мои' },
];

export const AppNav: React.FC = () => {
  const { path } = useCurrentState();
  const [selected, setSelected] = useState<Route>(path as Route);

  const onClick = (to: Route) => () => {
    if (to !== selected) replace(to);

    setSelected(to);
  };

  return (
    <HorizontalScroll showArrows>
      <Tabs>
        {routes.map(({ to, label }) => (
          <TabsItem
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
