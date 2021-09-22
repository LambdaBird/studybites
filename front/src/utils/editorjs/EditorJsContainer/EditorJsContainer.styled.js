import { createGlobalStyle } from 'styled-components';

import variables from '@sb-ui/theme/variables';

export const GlobalStylesEditorPage = createGlobalStyle`
  .ce-toolbar__plus::after{
    content: '${(props) => props.toolbarHint}';
    position: absolute;
    left: 36px;
    width: 300px;
    user-select: none;
    pointer-events: none;
    color: ${variables['editorjs-grey-color']};
  }
  
  .ce-toolbox{
    flex-direction: column;
    transform: translate3d(0px,0px,0px)!important;
    background-color: white;
    height: 400px;
    overflow-y: scroll;
    padding: 1rem;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05);
    .ce-toolbox__button{
      width: 100%;
      display: flex;
      justify-content: start;
      -webkit-animation: none;
      animation:  none;
    }
    
    .toolbox-blocks-title{
      user-select: none;
      color: rgba(0, 0, 0, 0.45);
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      margin-bottom: 0.5rem;
    }
    
    .toolbox-interactive-blocks, .toolbox-basic-blocks{
      display: flex;
      flex-direction: column;
      align-items: start;
      gap: 1rem;
    }
    .toolbox-basic-blocks{
      margin-bottom: 1rem;
    }
    .toolbox-svg-wrapper{
      border: 1px solid #F5F5F5;
      padding: 8px;
      height: 36px;
      width: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      svg{
        height: 20px;
        width: 20px;
      }
    }
    
    .toolbox-block-wrapper{
      display: flex;
      margin-left: 1rem;
      align-items: center;
      user-select: none;
      .toolbox-block-data-name{
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
      }
      .toolbox-block-data-description{
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
`;
