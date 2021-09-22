import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import config from '@sb-ui/utils/api/config';

import convertToolNameToTranslateKey from './convertToolNameToTranslateKey';
import getBasicAndInteractiveItems from './getBasicAndInteractiveItems';

const { interactiveBlocks } = config;

export const useToolbox = () => {
  const { t } = useTranslation('editorjs');
  const toolbox = useRef(null);

  const updateLanguage = useCallback(() => {
    const blocks = Array.from(
      toolbox.current?.querySelectorAll('.ce-toolbox__button') || [],
    );
    blocks.forEach((block) => {
      const translateToolKey = convertToolNameToTranslateKey(
        block.dataset.tool,
      );
      const title = block.querySelector('.toolbox-block-data-name');
      title.innerText = t(`tools.${translateToolKey}.title`);

      const description = block.querySelector(
        '.toolbox-block-data-description',
      );
      description.innerText = t(`tools.${translateToolKey}.description`);
    });
    const [basicTitle, interactiveTitle] = Array.from(
      toolbox.current?.querySelectorAll('.toolbox-blocks-title') || [],
    );
    if (basicTitle) {
      basicTitle.innerText = t('tools.basic_blocks');
    }
    if (interactiveTitle) {
      interactiveTitle.innerText = t('tools.interactive_blocks');
    }
  }, [t]);

  const createDivWithClassName = (className) => {
    const element = document.createElement('div');
    element.classList.add(className);
    return element;
  };

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
      const translateToolName = convertToolNameToTranslateKey(
        item.dataset.tool,
      );
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

    const basicBlocksTitle = createDivWithClassName('toolbox-blocks-title');
    basicBlocksTitle.innerText = t('tools.basic_blocks');
    const basicBlocksWrapper = createDivWithClassName('toolbox-basic-blocks');
    const interactiveBlocksTitle = createDivWithClassName(
      'toolbox-blocks-title',
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
