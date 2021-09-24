import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import config from '@sb-ui/utils/api/config';

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
    const blocks =
      toolbox.current?.querySelectorAll('.ce-toolbox__button') || [];
    if (blocks.length === 0) {
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
    (toolName) => {
      const itemData = createDivWithClassName('toolbox-block-data');
      const itemDataName = createDivWithClassName('toolbox-block-data-name');
      itemDataName.innerText = t(`tools.${toolName}.title`);
      const itemDataDescription = createDivWithClassName(
        'toolbox-block-data-description',
      );
      itemDataDescription.innerText = t(`tools.${toolName}.description`);
      itemData.appendChild(itemDataName);
      itemData.appendChild(itemDataDescription);
      return itemData;
    },
    [t],
  );

  const insertItem = useCallback(
    (item, blocks, items) => {
      const blockItem = items.find((x) => x.dataset.tool === item.dataset.tool);
      const translateToolName = getTranslationKey(item.dataset.tool);
      const itemWrapper = createDivWithClassName('toolbox-block-wrapper');

      const itemData = createItemData(translateToolName);
      itemWrapper.appendChild(itemData);

      const svgWrapper = createDivWithClassName('toolbox-svg-wrapper');
      const svgElement = blockItem.querySelector('svg');
      svgWrapper.appendChild(svgElement);

      blockItem.appendChild(svgWrapper);
      blockItem.appendChild(itemWrapper);
    },
    [createItemData],
  );

  const appendItemsToBlock = useCallback(
    (items, blockWrapper) => {
      items.forEach((item) => {
        blockWrapper.appendChild(item);
        insertItem(item, blockWrapper, items);
      });
    },
    [insertItem],
  );

  const prepareToolbox = useCallback(() => {
    toolbox.current = document.querySelector('.ce-toolbox');
    const wrapper = toolbox.current;
    const basicCheck = wrapper?.querySelector('.toolbox-basic-blocks');
    if (!wrapper || basicCheck) {
      return;
    }

    const basicBlocksTitle = createDivWithClassName(
      'toolbox-basic-blocks-title',
    );
    basicBlocksTitle.innerText = t('tools.basic_blocks');
    const basicBlocksWrapper = createDivWithClassName('toolbox-basic-blocks');
    const interactiveBlocksTitle = createDivWithClassName(
      'toolbox-interactive-blocks-title',
    );
    interactiveBlocksTitle.innerText = t('tools.interactive_blocks');
    const interactiveBlocksWrapper = createDivWithClassName(
      'toolbox-interactive-blocks',
    );

    wrapper.appendChild(basicBlocksTitle);
    wrapper.appendChild(basicBlocksWrapper);
    wrapper.appendChild(interactiveBlocksTitle);
    wrapper.appendChild(interactiveBlocksWrapper);

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
