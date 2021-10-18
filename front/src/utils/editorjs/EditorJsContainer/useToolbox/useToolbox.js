import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSearch } from '@sb-ui/utils/editorjs/EditorJsContainer/useToolbox/useSearch';

import {
  appendItems,
  createDivWithClassName,
  createInputWithClassName,
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
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const itemsRef = useRef(null);
  const currentItemRef = useRef(null);

  useSearch({ itemsRef, inputRef, currentItemRef, isOpen, value });

  useEffect(() => {
    if (isReady) {
      const observer = initObserver(toolbox.current, {
        setIsOpen,
      });
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

    const input = createInputWithClassName({
      className: 'toolbox-input-search',
      placeholder: t('tools.search_placeholder'),
      events: {
        input: (e) => {
          setValue(e.target.value);
        },
        focusout: () => {
          input.focus({ preventScroll: true });
        },
      },
    });
    inputRef.current = input;
    appendItems({
      node: wrapper,
      items: [
        input,
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
    itemsRef.current = items;
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
