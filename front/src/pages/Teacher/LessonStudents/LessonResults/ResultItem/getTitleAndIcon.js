import HtmlToReact from 'html-to-react';

const IconParser = new HtmlToReact.Parser();

export const getTitleAndIcon = (icons, block, t) => {
  const blockIcon = icons[block.type];
  const { title, icon } = blockIcon.toolbox || blockIcon.class.toolbox;
  const toolKey = title
    .split(' ')
    .map((word) => word.toLowerCase())
    .join('_');
  return {
    icon: IconParser.parse(icon.trim()),
    title: t(`editorjs:tools.${toolKey}.title`),
  };
};
