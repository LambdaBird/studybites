import {
  getBaseBlocks,
  getInteractiveBlocks,
} from '@sb-ui/pages/Teacher/LessonEdit/utils';
import {
  TOOLBOX_BUTTON_ACTIVE_CLASS,
  TOOLBOX_ITEM_NONE,
} from '@sb-ui/utils/editorjs/EditorJsContainer/useToolbox/constants';

const createMenuItems = (blocksName, items) => {
  const menuItems = new Map();
  blocksName.forEach((blockName) => {
    const block = items.find((item) => item.dataset.tool === blockName);
    if (block) {
      menuItems.set(blockName, block);
    }
  });
  return menuItems;
};

export const getBasicAndInteractiveItems = (items) => {
  const baseBlocksName = Object.keys(getBaseBlocks(() => {}));
  const interactiveBlocksName = Object.keys(getInteractiveBlocks(() => {}));

  const basicMenuItems = createMenuItems(baseBlocksName, items);
  const interactiveMenuItems = createMenuItems(interactiveBlocksName, items);

  return [basicMenuItems, interactiveMenuItems];
};

export const getTitleKeys = (parentNode) => [
  {
    parentNode,
    key: `tools.basic_blocks`,
    selector: '.toolbox-basic-items-title',
  },
  {
    parentNode,
    key: `tools.interactive_blocks`,
    selector: '.toolbox-interactive-items-title',
  },
];

export const getTranslationKey = (name) => {
  switch (name) {
    case 'fillTheGap':
      return 'fill_the_gap';
    case 'closedQuestion':
      return 'closed_question';
    case 'gradedQuestion':
      return 'graded_question';
    default:
      return name;
  }
};

export const selectItemsDescKeys = (item) => {
  const parentNode = item;
  const blockKey = getTranslationKey(item?.dataset?.tool);
  return [
    {
      parentNode,
      key: `tools.${blockKey}.description`,
      selector: '.toolbox-item-data-description',
    },
    {
      parentNode,
      key: `tools.${blockKey}.title`,
      selector: '.toolbox-item-data-name',
    },
  ];
};

export const getSelectingIndexes = (current, items, tabNext) => {
  const index = items.findIndex((item) => item === current);

  if (tabNext) {
    if (current === null) {
      return [-1, 0];
    }
    if (index === items.length - 1) {
      return [index, 0];
    }
    return [index, index + 1];
  }
  if (current === null) {
    return [-1, items.length - 1];
  }

  if (index === 0) {
    return [0, items.length - 1];
  }
  return [index, index - 1];
};

export const resetItems = (items) => {
  items?.forEach((item) => {
    item.classList.remove(TOOLBOX_ITEM_NONE);
    item.classList.remove(TOOLBOX_BUTTON_ACTIVE_CLASS);
  });
};
