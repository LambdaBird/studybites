const getTitleKeys = (parentNode) => [
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

export default getTitleKeys;
