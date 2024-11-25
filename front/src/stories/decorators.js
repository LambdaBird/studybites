import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { QueryClientProvider } from 'react-query';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';

import LearnContext from '@sb-ui/contexts/LearnContext';
import { getConfig } from '@sb-ui/pages/Teacher/LessonEdit/utils';
import { queryClient } from '@sb-ui/query';
import EditorJs from '@sb-ui/utils/editorjs/EditorJsContainer/EditorJsContainer';

const newConfigTool = (configTools, allowedToolbox) => {
  const config = {};
  allowedToolbox.forEach((tool) => {
    config[tool] = configTools[tool];
  });
  return config;
};

export const EditorJsDecorator = ({ blocks, allowedToolbox }) => {
  const { t } = useTranslation('teacher');
  const configTools = newConfigTool(getConfig(t).tools, allowedToolbox);

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <EditorJs tools={configTools} data={{ blocks }} />
  );
};

EditorJsDecorator.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  blocks: PropTypes.array,
  allowedToolbox: PropTypes.arrayOf(PropTypes.string),
};

export const QueryContextDecorator = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

QueryContextDecorator.propTypes = {
  children: PropTypes.node,
};

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
