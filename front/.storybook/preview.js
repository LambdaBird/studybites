import 'antd/dist/antd.css';
import { addDecorator, addParameters } from '@storybook/react';
import { withI18n } from 'storybook-addon-i18n';
import StoryRouter from 'storybook-react-router';
import 'storybook-addon-i18n/register.js';
import i18n from '../src/i18n';
import { I18nProviderWrapper } from './I18nProviderWrapper';
import { configureActions } from '@storybook/addon-actions';

configureActions({
  depth: 100,
  limit: 20,
});

addParameters({
  i18n: {
    provider: I18nProviderWrapper,
    providerProps: {
      i18n,
    },
    supportedLocales: ['en', 'ru'],
    providerLocaleKey: 'locale',
  },
});

addDecorator(StoryRouter());

addDecorator(withI18n);

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
