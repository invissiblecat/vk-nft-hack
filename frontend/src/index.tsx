import './bridge';

import { init, Router } from '@cteamdev/router';
import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

init();

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root'),
);

// if (process.env.NODE_ENV === 'development') { import('./eruda'); }
import('./eruda');
