import HtmlToReact from 'html-to-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Paragraph from '@editorjs/paragraph'; // TODO: remove this when tools will be defined in one place

import { getConfig } from '../../LessonEdit/utils';

const IconParser = new HtmlToReact.Parser();

const useBlocksIcons = ({ blocks }) => {
  const { t } = useTranslation();

  const blocksList = useMemo(
    () => ({
      ...getConfig(t).tools,
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
      },
    }),
    [t],
  );

  const icons = useMemo(
    () =>
      (blocks || [])
        .map((type) => blocksList[type])
        .filter((block) => !!block)
        .map((block) => block.toolbox || block.class.toolbox)
        .map((toolbox, i) => ({
          key: toolbox.title + i,
          title: toolbox.title,
          icon: IconParser.parse(toolbox.icon),
        })),
    [blocks, blocksList],
  );

  return icons;
};

export default useBlocksIcons;
