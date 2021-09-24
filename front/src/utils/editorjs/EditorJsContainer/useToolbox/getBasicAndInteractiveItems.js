const getTranslationKey = (items, interactiveItemsName) => {
  const interactiveItems = items.filter((block) =>
    interactiveItemsName.includes(block.dataset.tool),
  );
  const basicItems = items.filter(
    (block) => !interactiveItemsName.includes(block.dataset.tool),
  );
  return [basicItems, interactiveItems];
};

export default getTranslationKey;
