export const chunksToInteractiveBlocks = (chunks, typesBlocks) =>
  chunks?.flat()?.filter((block) => typesBlocks.includes(block.type)) || [];
