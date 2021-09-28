import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import config from '@sb-ui/utils/api/config';

import {
  appendItems,
  createDivWithClassName,
  getToolboxBlocks,
  transformDefaultMenuItems,
  updateInnerText,
} from './domToolboxHelpers';
import {
  getBasicAndInteractiveItems,
  getTitleKeys,
  selectBlocksDescKeys,
} from './toolboxItemsHelpers';

const { interactiveBlocks } = config;

export const useToolbox = () => {
  const { t } = useTranslation('editorjs');
  const toolbox = useRef(null);

  const updateLanguage = useCallback(() => {
    if (!toolbox.current) {
      return;
    }
    Array.from(getToolboxBlocks(toolbox.current))
      .map(selectBlocksDescKeys)
      .flat()
      .concat(getTitleKeys(toolbox.current))
      .map(({ parentNode, selector, key }) => ({
        parentNode,
        selector,
        text: t(key),
      }))
      .forEach(updateInnerText);
  }, [t]);

  const prepareToolbox = useCallback(() => {
    toolbox.current = document.querySelector('.ce-toolbox');
    const wrapper = toolbox.current;
    const basicCheck = wrapper?.querySelector('.toolbox-basic-blocks');
    if (!wrapper || basicCheck) {
      return;
    }

    const basicBlocksWrapper = createDivWithClassName({
      className: 'toolbox-basic-blocks',
    });
    const interactiveBlocksWrapper = createDivWithClassName({
      className: 'toolbox-interactive-blocks',
    });

    appendItems({
      node: wrapper,
      items: [
        createDivWithClassName({
          className: 'toolbox-basic-blocks-title',
          innerText: t('tools.basic_blocks'),
        }),
        basicBlocksWrapper,
        createDivWithClassName({
          className: 'toolbox-interactive-blocks-title',
          innerText: t('tools.interactive_blocks'),
        }),
        interactiveBlocksWrapper,
      ],
    });

    const items = Array.from(getToolboxBlocks(toolbox.current));
    const [basicItems, interactiveItems] = getBasicAndInteractiveItems(
      items,
      interactiveBlocks,
    );

    transformDefaultMenuItems(interactiveItems, interactiveBlocksWrapper, t);
    transformDefaultMenuItems(basicItems, basicBlocksWrapper, t);
  }, [t]);

  return {
    prepareToolbox,
    updateLanguage,
  };
};
