import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import config from '@sb-ui/utils/api/config';
import appendItems from '@sb-ui/utils/editorjs/EditorJsContainer/useToolbox/appendItems';

import createDivWithClassName from './createDivWithClassName';
import getBasicAndInteractiveItems from './getBasicAndInteractiveItems';
import getTranslationKey from './getTranslationKey';
import selectBlocksDescKeys from './selectBlockDescKeys';
import updateInnerText from './updateInnerText';

const { interactiveBlocks } = config;

export const useToolbox = () => {
  const { t } = useTranslation('editorjs');
  const toolbox = useRef(null);

  const updateLanguage = useCallback(() => {
    if (!toolbox.current) {
      return;
    }
    Array.from(toolbox.current?.querySelectorAll('.ce-toolbox__button') || [])
      .map(selectBlocksDescKeys)
      .flat()
      .concat(
        {
          parentNode: toolbox.current,
          key: `tools.basic_blocks`,
          selector: '.toolbox-basic-blocks-title',
        },
        {
          parentNode: toolbox.current,
          key: `tools.interactive_blocks`,
          selector: '.toolbox-interactive-blocks-title',
        },
      )
      .map(({ parentNode, selector, key }) => ({
        parentNode,
        selector,
        text: t(key),
      }))
      .forEach(updateInnerText);
  }, [t]);

  const createItemData = useCallback(
    (toolName) =>
      createDivWithClassName({
        className: 'toolbox-block-data',
        items: [
          createDivWithClassName({
            className: 'toolbox-block-data-name',
            innerText: t(`tools.${toolName}.title`),
          }),
          createDivWithClassName({
            className: 'toolbox-block-data-description',
            innerText: t(`tools.${toolName}.description`),
          }),
        ],
      }),
    [t],
  );

  const appendItemsToBlock = useCallback(
    (items, block) => {
      items.forEach((item) => {
        block.appendChild(item);
        const blockItem = items.find(
          (x) => x.dataset.tool === item.dataset.tool,
        );
        const translateToolName = getTranslationKey(item.dataset.tool);
        appendItems({
          node: blockItem,
          items: [
            createDivWithClassName({
              className: 'toolbox-svg-wrapper',
              items: [blockItem.querySelector('svg')],
            }),
            createDivWithClassName({
              className: 'toolbox-block-wrapper',
              items: [createItemData(translateToolName)],
            }),
          ],
        });
      });
    },
    [createItemData],
  );

  const prepareToolbox = useCallback(() => {
    toolbox.current = document.querySelector('.ce-toolbox');
    const wrapper = toolbox.current;
    const basicCheck = wrapper?.querySelector('.toolbox-basic-blocks');
    if (!wrapper || basicCheck) {
      return;
    }

    const basicBlocksWrapper = createDivWithClassName({
      className: 'toolbox-basic-blocks',
    });
    const interactiveBlocksWrapper = createDivWithClassName({
      className: 'toolbox-interactive-blocks',
    });

    appendItems({
      node: wrapper,
      items: [
        createDivWithClassName({
          className: 'toolbox-basic-blocks-title',
          innerText: t('tools.basic_blocks'),
        }),
        basicBlocksWrapper,
        createDivWithClassName({
          className: 'toolbox-interactive-blocks-title',
          innerText: t('tools.interactive_blocks'),
        }),
        interactiveBlocksWrapper,
      ],
    });

    const items = Array.from(document.querySelectorAll('.ce-toolbox__button'));
    const [basicItems, interactiveItems] = getBasicAndInteractiveItems(
      items,
      interactiveBlocks,
    );

    appendItemsToBlock(interactiveItems, interactiveBlocksWrapper);
    appendItemsToBlock(basicItems, basicBlocksWrapper);
  }, [appendItemsToBlock, t]);

  return {
    prepareToolbox,
    updateLanguage,
  };
};
