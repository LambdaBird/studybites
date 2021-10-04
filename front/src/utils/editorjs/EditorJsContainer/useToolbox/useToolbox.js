import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  appendItems,
  createDivWithClassName,
  getToolboxItems,
  transformDefaultMenuItems,
  updateInnerText,
} from './domToolboxHelpers';
import {
  getBasicAndInteractiveItems,
  getTitleKeys,
  selectItemsDescKeys,
} from './toolboxItemsHelpers';
import { destroyObserver, initObserver } from './toolboxObserver';

export const useToolbox = () => {
  const { t } = useTranslation('editorjs');
  const toolbox = useRef(null);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (isReady) {
      const observer = initObserver(toolbox.current);
      return () => {
        destroyObserver(observer);
      };
    }
    return () => {};
  }, [isReady]);

  const updateLanguage = useCallback(() => {
    if (!toolbox.current) {
      return;
    }
    Array.from(getToolboxItems(toolbox.current))
      .map(selectItemsDescKeys)
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
    const basicCheck = wrapper?.querySelector('.toolbox-basic-items');
    if (!wrapper || basicCheck) {
      return;
    }

    const basicMenuItemsWrapper = createDivWithClassName({
      className: 'toolbox-basic-items',
    });
    const interactiveMenuItemsWrapper = createDivWithClassName({
      className: 'toolbox-interactive-items',
    });

    appendItems({
      node: wrapper,
      items: [
        createDivWithClassName({
          className: 'toolbox-basic-items-title',
          innerText: t('tools.basic_blocks'),
        }),
        basicMenuItemsWrapper,
        createDivWithClassName({
          className: 'toolbox-interactive-items-title',
          innerText: t('tools.interactive_blocks'),
        }),
        interactiveMenuItemsWrapper,
      ],
    });

    const items = Array.from(getToolboxItems(toolbox.current));
    const [basicItems, interactiveItems] = getBasicAndInteractiveItems(items);

    transformDefaultMenuItems(interactiveItems, interactiveMenuItemsWrapper, t);
    transformDefaultMenuItems(basicItems, basicMenuItemsWrapper, t);
    setIsReady(true);
  }, [t]);

  return {
    prepareToolbox,
    updateLanguage,
  };
};
