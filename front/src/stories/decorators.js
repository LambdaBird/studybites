import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';

import LearnContext from '@sb-ui/contexts/LearnContext';

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

LearnContextDecorator.propTypes = {
  children: PropTypes.node,
};

export const LearnContextChunksDecorator = ({ children, chunks }) => (
  <LearnContext.Provider value={{ chunks }}>{children}</LearnContext.Provider>
);

LearnContextChunksDecorator.propTypes = {
  children: PropTypes.node,
  chunks: PropTypes.arrayOf(PropTypes.array),
};
