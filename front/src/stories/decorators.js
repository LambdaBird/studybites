import { action } from '@storybook/addon-actions';

import LearnContext from '@sb-ui/contexts/LearnContext';

// eslint-disable-next-line react/prop-types
export const LearnContextDecorator = ({ children }) => {
  const handleInteractiveClick = (params) => {
    action('Interactive click')(params);
  };

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <LearnContext.Provider value={{ handleInteractiveClick, id: 2 }}>
      {children}
    </LearnContext.Provider>
  );
};

// eslint-disable-next-line react/prop-types
export const LearnContextChunksDecorator = ({ children, chunks }) => (
  <LearnContext.Provider value={{ chunks }}>{children}</LearnContext.Provider>
);
