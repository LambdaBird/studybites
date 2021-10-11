import { allowedTypes } from '@sb-ui/utils/constants';

import { uploadFile } from '../utils';

import { ToolboxIcon } from './resources';

import './index.css';

const MAX_NAME_LENGTH = 50;

function createElement({ tagName = 'div', classList = [], items = [] } = {}) {
  const element = document.createElement(tagName);
  element.classList.add(...classList);
  items.forEach((item) => {
    element.appendChild(item);
  });
  return element;
}

export default class AttachPlugin {
  constructor({ data, api, config, readOnly }) {
    this.data = data;
    this.api = api;
    this.config = config;
    this.readOnly = readOnly;

    this.nodes = {
      container: null,
      pluginTitle: null,
      fileInput: null,
      uploadButton: null,
      label: null,
    };
    this.isLoading = false;
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      icon: ToolboxIcon,
      title: 'Attach',
    };
  }

  // eslint-disable-next-line class-methods-use-this
  get CSS() {
    return {
      titleWrapper: 'attach-plugin__titleWrapper',
      title: 'attach-plugin__title',
      file: 'attach-plugin__file',
      fileInput: 'attach-plugin__file-input',
    };
  }

  save() {
    return this.data;
  }

  onSuccess = (response) => {
    this.isLoading = false;
    this.nodes.fileInput.disabled = false;
    this.data = response.data;
    if (this.data.name.length > MAX_NAME_LENGTH) {
      this.nodes.label.innerText = `${this.data.name.slice(
        0,
        MAX_NAME_LENGTH,
      )}...`;
    } else {
      this.nodes.label.innerText = this.data.name;
    }
  };

  onError = ({ response }) => {
    this.isLoading = false;
    this.nodes.fileInput.disabled = false;
    const [, errorMessage] = response?.data?.message?.split('.');
    const labelKey = response?.status === 400 ? errorMessage : 'error';
    this.nodes.label.innerText = this.api.i18n.t(labelKey);
  };

  onChange = async () => {
    this.isLoading = true;
    this.nodes.fileInput.disabled = true;
    await uploadFile({
      parent: this.nodes.fileInput,
      config: this.config,
      onSuccess: this.onSuccess,
      onError: this.onError,
    });
  };

  preparePluginTitle() {
    const title = createElement({
      tagName: 'span',
      classList: [this.CSS.title],
    });
    title.innerText = this.api.i18n.t('title');
    this.nodes.pluginTitle = createElement({
      classList: [this.CSS.titleWrapper],
      items: [title],
    });
    this.nodes.container.appendChild(this.nodes.pluginTitle);
  }

  prepareFileInput() {
    this.nodes.fileInput = createElement({
      tagName: 'input',
      classList: [this.CSS.file],
    });
    this.nodes.fileInput.type = 'file';
    this.nodes.fileInput.id = `${Math.random()}-attach-input`;
    this.nodes.fileInput.accept = allowedTypes;
    this.nodes.fileInput.addEventListener('change', this.onChange);
    this.nodes.fileInput.disabled = this.readOnly || this.isLoading;
    this.nodes.label = createElement({
      tagName: 'label',
    });
    this.nodes.label.htmlFor = this.nodes.fileInput.id;
    this.nodes.label.innerText = this.data.name || this.api.i18n.t('select');
    const wrapper = createElement({
      classList: [this.CSS.fileInput],
      items: [this.nodes.fileInput, this.nodes.label],
    });
    this.nodes.container.appendChild(wrapper);
  }

  render() {
    this.nodes.container = createElement();
    this.preparePluginTitle();
    this.prepareFileInput();
    return this.nodes.container;
  }
}
