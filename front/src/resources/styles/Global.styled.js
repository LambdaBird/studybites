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
  .header-dropdown-mobile{
    top: 56px !important;
    width: 100%;
  }

  body{
    background-color: ${variables['body-background-color']}; 
  }
`;
