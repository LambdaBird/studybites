import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import './theme/main.less';

import App from './App';
import './i18n';

const GlobalStyle = createGlobalStyle`
  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <App />
    <GlobalStyle />
  </React.StrictMode>,
  document.getElementById('root'),
);
