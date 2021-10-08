const TOOLBOX_BUTTON_ACTIVE_CLASS = 'ce-toolbox__button--active';

export const initObserver = (targetNode) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(({ attributeName, target }) => {
      if (
        attributeName === 'class' &&
        target.classList.contains(TOOLBOX_BUTTON_ACTIVE_CLASS)
      ) {
        target.scrollIntoViewIfNeeded();
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
