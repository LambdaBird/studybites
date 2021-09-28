export const getBasicAndInteractiveItems = (items, interactiveItemsName) => {
  const basicItems = new Map();
  const interactiveItems = new Map();
  items.forEach((block) => {
    const toolName = block.dataset.tool;
    if (interactiveItemsName.includes(toolName)) {
      interactiveItems.set(toolName, block);
    } else {
      basicItems.set(toolName, block);
    }
  });
  return [basicItems, interactiveItems];
};

export const getTitleKeys = (parentNode) => [
  {
    parentNode,
    key: `tools.basic_blocks`,
    selector: '.toolbox-basic-blocks-title',
  },
  {
    parentNode,
    key: `tools.interactive_blocks`,
    selector: '.toolbox-interactive-blocks-title',
  },
];

export const getTranslationKey = (name) => {
  switch (name) {
    case 'fillTheGap':
      return 'fill_the_gap';
    case 'closedQuestion':
      return 'closed_question';
    default:
      return name;
  }
};

export const selectBlocksDescKeys = (block) => {
  const parentNode = block;
  const blockKey = getTranslationKey(block?.dataset?.tool);
  return [
    {
      parentNode,
      key: `tools.${blockKey}.description`,
      selector: '.toolbox-block-data-description',
    },
    {
      parentNode,
      key: `tools.${blockKey}.title`,
      selector: '.toolbox-block-data-name',
    },
  ];
};
