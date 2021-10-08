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
