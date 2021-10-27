import { TOOLBOX_UPPER } from '@sb-ui/utils/editorjs/EditorJsContainer/useToolbox/constants';

import { getTranslationKey } from './toolboxItemsHelpers';

export const appendItems = ({ node, items = [] }) => {
  items.forEach((item) => {
    node?.appendChild(item);
  });
};

export const createDivWithClassName = ({
  className,
  innerText = '',
  items = [],
}) => {
  const element = document.createElement('div');
  element.classList.add(className);
  element.innerText = innerText;
  items.forEach((item) => {
    element.appendChild(item);
  });
  return element;
};

export const createInputWithClassName = ({
  className,
  placeholder,
  events,
}) => {
  const element = document.createElement('input');
  element.classList.add(className);
  element.placeholder = placeholder;
  Object.entries(events).forEach(([eventName, func]) => {
    element.addEventListener(eventName, func);
  });
  return element;
};

export const getToolboxItems = (parent) =>
  parent?.querySelectorAll('.ce-toolbox__button') || [];

export const updateInnerText = ({ parentNode, text, selector }) => {
  const element = parentNode.querySelector(selector);
  if (element) {
    element.innerText = text;
  }
};

export const createItemData = (toolName, t) =>
  createDivWithClassName({
    className: 'toolbox-item-data',
    items: [
      createDivWithClassName({
        className: 'toolbox-item-data-name',
        innerText: t(`tools.${toolName}.title`),
      }),
      createDivWithClassName({
        className: 'toolbox-item-data-description',
        innerText: t(`tools.${toolName}.description`),
      }),
    ],
  });

export const transformDefaultMenuItems = (items, block, t) => {
  items.forEach((item) => {
    block.appendChild(item);
    const blockItem = items.get(item.dataset.tool);
    const translateToolName = getTranslationKey(item.dataset.tool);
    appendItems({
      node: blockItem,
      items: [
        createDivWithClassName({
          className: 'toolbox-svg-wrapper',
          items: [blockItem.querySelector('svg')],
        }),
        createDivWithClassName({
          className: 'toolbox-item-wrapper',
          items: [createItemData(translateToolName, t)],
        }),
      ],
    });
  });
};

export const TOP_OVERLAPS = 'top';
export const BOTTOM_OVERLAPS = 'bottom';

export const getElementOverlapsPosition = (el) => {
  const rect = el.getBoundingClientRect();
  if (rect.top < 0) {
    return TOP_OVERLAPS;
  }
  if (
    rect.bottom > (window.innerHeight || document.documentElement.clientHeight)
  ) {
    return BOTTOM_OVERLAPS;
  }

  return null;
};

export const toggleToolboxPosition = (element, position) => {
  if (position === BOTTOM_OVERLAPS) {
    element.classList.add(TOOLBOX_UPPER);
  } else {
    element.classList.remove(TOOLBOX_UPPER);
  }
};
