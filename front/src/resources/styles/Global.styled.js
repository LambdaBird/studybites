import { createGlobalStyle } from 'styled-components';

import variables from '@sb-ui/theme/variables';

export const GlobalStyles = createGlobalStyle`
  html, body {
    height: 100%; 
    margin: 0; 
  }
  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  body{
    background-color: ${variables['body-background-color']}; 
  }
`;
