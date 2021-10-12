import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getItemsFilteredByValue,
  makeFirstItemActive,
  setCurrentRef,
  setCurrentRefValue,
} from '@sb-ui/utils/editorjs/EditorJsContainer/useToolbox/searchHelpers';
import {
  getSelectingIndexes,
  resetItems,
} from '@sb-ui/utils/editorjs/EditorJsContainer/useToolbox/toolboxItemsHelpers';

import {
  KEYS,
  TOOLBOX_BUTTON_ACTIVE_CLASS,
  TOOLBOX_ITEM_NONE,
} from './constants';

export const useSearch = ({
  itemsRef,
  inputRef,
  currentItemRef,
  isOpen,
  value,
}) => {
  const { t } = useTranslation('editorjs');
  const selectNext = useCallback(
    (tabNext) => {
      const visibleItems = itemsRef.current.filter(
        (item) => !item.classList.contains(TOOLBOX_ITEM_NONE),
      );
      const [fromIndex, toIndex] = getSelectingIndexes(
        currentItemRef.current,
        visibleItems,
        tabNext,
      );
      if (fromIndex !== -1) {
        visibleItems[fromIndex].classList.remove(TOOLBOX_BUTTON_ACTIVE_CLASS);
      }
      setCurrentRef(currentItemRef, visibleItems[toIndex]);
      currentItemRef.current.classList.add(TOOLBOX_BUTTON_ACTIVE_CLASS);
    },
    [currentItemRef, itemsRef],
  );

  const handleKeyDown = useCallback(
    (e) => {
      e.stopImmediatePropagation();
      switch (e.code) {
        case KEYS.ARROW_UP:
          selectNext(false);
          break;
        case KEYS.ARROW_DOWN:
          selectNext(true);
          break;
        case KEYS.TAB:
          if (e.shiftKey === true) {
            selectNext(false);
          } else {
            selectNext(true);
          }
          break;
        case KEYS.ENTER:
          currentItemRef.current?.click?.();
          break;
        default:
          break;
      }
    },
    [currentItemRef, selectNext],
  );

  useEffect(() => {
    if (isOpen) {
      inputRef.current.focus();
      setCurrentRefValue(inputRef, '');
      makeFirstItemActive(itemsRef.current, currentItemRef);
      inputRef.current?.addEventListener('keydown', handleKeyDown);
    } else {
      resetItems(itemsRef.current);
      inputRef.current?.removeEventListener('keydown', handleKeyDown);
    }
  }, [currentItemRef, handleKeyDown, inputRef, isOpen, itemsRef]);

  useEffect(() => {
    resetItems(itemsRef.current);
    const filtered = getItemsFilteredByValue(value, itemsRef.current, t);

    filtered?.forEach((element) => {
      element.classList.add(TOOLBOX_ITEM_NONE);
    });

    makeFirstItemActive(itemsRef.current, currentItemRef);
  }, [currentItemRef, itemsRef, t, value]);
};
