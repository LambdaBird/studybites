import getTranslationKey from './getTranslationKey';

const selectBlocksDescKeys = (block) => {
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

export default selectBlocksDescKeys;
