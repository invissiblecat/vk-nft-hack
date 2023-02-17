import { push } from '@cteamdev/router';

import { ModalRoute, Route } from '../../../app/enums';

export const openModal = (root: Route, modal: ModalRoute) => push(`${root}/?modal=${modal}`);
export const openModalCallback = (root: Route, modal: ModalRoute) => () => openModal(root, modal);
