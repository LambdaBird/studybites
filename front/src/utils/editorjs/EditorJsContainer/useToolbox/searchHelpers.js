import { TOOLBOX_BUTTON_ACTIVE_CLASS, TOOLBOX_ITEM_NONE } from './constants';
import { getTranslationKey } from './toolboxItemsHelpers';

export const getItemsFilteredByValue = (value, items, t) =>
  items?.filter((item) => {
    const translationKey = t(getTranslationKey(item.dataset.tool));
    const name = t(`tools.${translationKey}.title`);
    return !name.toLowerCase().includes(value.toLowerCase());
  });

export const setCurrentRef = (ref, value) => {
  // eslint-disable-next-line no-param-reassign
  ref.current = value;
};

export const setCurrentRefValue = (ref, value) => {
  // eslint-disable-next-line no-param-reassign
  ref.current.value = value;
};

export const makeFirstItemActive = (items, currentItemRef) => {
  const goodItems = items?.filter(
    (item) => !item.classList.contains(TOOLBOX_ITEM_NONE),
  );
  setCurrentRef(currentItemRef, goodItems?.[0] || null);
  currentItemRef.current?.classList?.add?.(TOOLBOX_BUTTON_ACTIVE_CLASS);
};
