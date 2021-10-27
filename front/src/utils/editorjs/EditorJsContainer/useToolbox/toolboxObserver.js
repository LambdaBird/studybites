import {
  TOOLBOX_BUTTON_ACTIVE_CLASS,
  TOOLBOX_OPENED,
  TOOLBOX_TOOLBOX,
} from './constants';

export const initObserver = (targetNode, { setIsOpen }) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(({ attributeName, target }) => {
      if (attributeName === 'class') {
        if (target.classList.contains(TOOLBOX_TOOLBOX)) {
          setIsOpen(target.classList.contains(TOOLBOX_OPENED));
        }
        if (target.classList.contains(TOOLBOX_BUTTON_ACTIVE_CLASS)) {
          target.scrollIntoViewIfNeeded();
        }
      }
    });
  });
  observer.observe(targetNode, {
    attributes: true,
    subtree: true,
  });

  return observer;
};

export const destroyObserver = (observer) => {
  observer.disconnect();
};
