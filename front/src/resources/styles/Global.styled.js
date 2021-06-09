import { createGlobalStyle } from 'styled-components';

export const WHITE_COLOR = 'white';

export const DESCRIPTION_COLOR = 'rgba(0, 0, 0, 0.45)';

export const VOLCANO_2 = '#ffd8bf';

export const VOLCANO_6 = '#fa541c';

export const BODY_BACKGROUND_COLOR = '#f5f5f5';

export const GlobalStyles = createGlobalStyle`
  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  body{
    background-color: ${BODY_BACKGROUND_COLOR}; 
  }
`;
