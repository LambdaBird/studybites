import { allowedTypes } from '@sb-ui/utils/constants';

import { ToolboxIcon } from './resources';
import Uploader from './uploader';

import './index.css';

const MAX_NAME_LENGTH = 50;

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

    this.uploader = new Uploader({
      config: this.config,
      onSuccess: this.onSuccess.bind(this),
      onError: this.onError.bind(this),
    });
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

  onSuccess(response) {
    this.data = response.data;
    if (this.data.name.length > MAX_NAME_LENGTH) {
      this.nodes.label.innerText = `${this.data.name.slice(
        0,
        MAX_NAME_LENGTH,
      )}...`;
    } else {
      this.nodes.label.innerText = this.data.name;
    }
  }

  onError = (e) => {
    // eslint-disable-next-line no-console
    console.log('attach error:', e);
  };

  onChange = async () => {
    await this.uploader.uploadFile();
  };

  preparePluginTitle() {
    this.nodes.pluginTitle = document.createElement('div');
    this.nodes.pluginTitle.classList.add(this.CSS.titleWrapper);

    const title = document.createElement('span');
    title.innerText = this.api.i18n.t('title');
    title.classList.add(this.CSS.title);

    this.nodes.pluginTitle.appendChild(title);

    this.nodes.container.appendChild(this.nodes.pluginTitle);
  }

  prepareFileInput() {
    const wrapper = document.createElement('div');
    wrapper.classList.add(this.CSS.fileInput);

    this.nodes.fileInput = document.createElement('input');
    this.nodes.fileInput.type = 'file';
    this.nodes.fileInput.id = 'file';
    this.nodes.fileInput.accept = allowedTypes;
    this.nodes.fileInput.classList.add(this.CSS.file);
    this.nodes.fileInput.onchange = this.onChange;

    this.nodes.label = document.createElement('label');
    this.nodes.label.htmlFor = 'file';
    this.nodes.label.innerText = this.data.name || this.api.i18n.t('select');

    wrapper.appendChild(this.nodes.fileInput);
    wrapper.appendChild(this.nodes.label);
    this.nodes.container.appendChild(wrapper);
  }

  render() {
    this.nodes.container = document.createElement('div');

    this.preparePluginTitle();
    this.prepareFileInput();

    return this.nodes.container;
  }
}
