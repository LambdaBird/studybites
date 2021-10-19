import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSearch } from '@sb-ui/utils/editorjs/EditorJsContainer/useToolbox/useSearch';
import { debounce } from '@sb-ui/utils/utils';

import {
  DEBOUNCE_SCROLL_TOOLBOX_TIME,
  TOOLBOX_OPENED,
  TOOLBOX_UPPER,
} from './constants';
import {
  appendItems,
  createDivWithClassName,
  createInputWithClassName,
  getElementOverlapsPosition,
  getToolboxItems,
  toggleToolboxPosition,
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

  useEffect(() => {
    if (isOpen) {
      const position = getElementOverlapsPosition(toolbox.current);
      toggleToolboxPosition(toolbox.current, position);
    } else {
      toolbox.current?.classList?.remove?.(TOOLBOX_UPPER);
    }
  }, [isOpen]);

  const handleScroll = useCallback(() => {
    const position = getElementOverlapsPosition(toolbox.current);
    if (position && toolbox.current.classList.contains(TOOLBOX_OPENED)) {
      toggleToolboxPosition(toolbox.current, position);
    }
  }, []);

  const handleScrollDebounced = useMemo(
    () => debounce(handleScroll, DEBOUNCE_SCROLL_TOOLBOX_TIME),
    [handleScroll],
  );

  useEffect(() => {
    document.addEventListener('scroll', handleScrollDebounced);
    return () => document.removeEventListener('scroll', handleScrollDebounced);
  }, [handleScrollDebounced]);

  return {
    prepareToolbox,
    updateLanguage,
  };
};
