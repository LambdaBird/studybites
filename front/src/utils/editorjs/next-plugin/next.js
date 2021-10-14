/* eslint-disable class-methods-use-this */
import PluginBase from '../PluginBase';

import { ToolboxIcon } from './resources';

import './next.css';

export default class Next extends PluginBase {
  constructor({ api, readOnly }) {
    super({
      title: api.i18n.t('title'),
    });

    this.api = api;
    this.readOnly = readOnly;
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      title: 'Next',
      icon: ToolboxIcon,
    };
  }

  get CSS() {
    return {
      baseClass: 'next-tool__base',
    };
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.appendChild(this.titleWrapper);

    wrapper.classList.add('next-tool__wrapper');
    const button = document.createElement('button');
    button.classList.add(this.CSS.baseClass);
    button.innerText = this.api.i18n.t('button');

    wrapper.appendChild(button);
    return wrapper;
  }

  save() {
    return {};
  }
}
