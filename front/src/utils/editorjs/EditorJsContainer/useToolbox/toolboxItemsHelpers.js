import {
  getBaseBlocks,
  getInteractiveBlocks,
} from '@sb-ui/pages/Teacher/LessonEdit/utils';

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
