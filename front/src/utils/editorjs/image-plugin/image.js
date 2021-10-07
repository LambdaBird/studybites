import PluginBase from '../PluginBase';
import * as Utils from '../utils';

import { ToolboxIcon } from './resources';

import './image.css';

export default class Image extends PluginBase {
  constructor({ data, api, readOnly }) {
    super({
      title: api.i18n.t('title'),
    });

    this.api = api;
    this.data = data;
    this.element = null;
    this.readOnly = readOnly;
    this.elements = [];
    this.error = null;
  }

  static get toolbox() {
    return {
      title: 'Image',
      icon: ToolboxIcon,
    };
  }

  get CSS() {
    return {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      container: 'image-tool',
      content: 'image-tool__content',
      caption: 'image-tool__caption',
      urlInput: 'image-tool__urlInput',
      error: 'image-tool__error',
    };
  }

  inputUrlChange() {
    const value = this.elements?.url?.value;
    this.content.src = value;

    const urlInput = this.elements?.url;
    urlInput.style.borderColor = '';

    this.content.onload = () => {
      this.error = false;
      this.elements.error.style.display = 'none';
      this.inputCaption.style.display = '';
      this.content.style.display = '';
      this.content.style.height = '';
      urlInput.style.borderColor = '';
    };

    this.content.onerror = () => {
      this.error = true;
      this.elements.error.style.display = '';
      this.content.style.display = 'none';
      this.data = {};
      this.inputCaption.style.display = 'none';
      urlInput.style.borderColor = 'red';
    };

    if (value.length === 0) {
      this.content.innerHTML = '';
      this.content.style.height = 0;
      this.data = {};
      this.inputCaption.style.display = 'none';
    }
  }

  render() {
    const container = document.createElement('div');
    this.container = container;
    container.classList.add(this.CSS.container);
    container.appendChild(this.titleWrapper);

    const inputUrl = Utils.createInput({
      wrapper: this,
      name: 'url',
      placeholder: this.api.i18n.t('input'),
      classList: [this.CSS.input, this.CSS.urlInput],
      readOnly: this.readOnly,
    });
    inputUrl.addEventListener('input', this.inputUrlChange.bind(this));
    inputUrl.addEventListener('click', () => {
      inputUrl.select();
    });

    const content = document.createElement('img');
    this.content = content;

    content.classList.add(this.CSS.content);

    const error = document.createElement('div');
    error.innerText = 'Please enter correct image url';
    error.style.display = 'none';
    error.classList.add(this.CSS.error);
    this.elements.error = error;

    const inputCaption = document.createElement('div');
    inputCaption.classList.add(this.CSS.input);
    inputCaption.classList.add(this.CSS.caption);
    if (!this.readOnly) {
      inputCaption.contentEditable = 'true';
    }
    inputCaption.setAttribute('placeholder', this.api.i18n.t('caption'));

    this.elements.caption = inputCaption;
    this.inputCaption = inputCaption;

    inputCaption.style.display = 'none';

    if (this.data.url) {
      inputUrl.value = this.data.url ?? '';
      inputCaption.innerHTML = this.data.caption ?? '';
      this.inputUrlChange();
    }

    container.appendChild(inputUrl);
    container.appendChild(content);
    container.appendChild(error);
    container.appendChild(inputCaption);

    inputUrl.addEventListener(
      'keydown',
      (event) => {
        if (event.keyCode === 8) {
          // BACKSPACE KEY CODE
          this.backspace(event);
        }
      },
      false,
    );
    return container;
  }

  backspace() {
    if (this.elements.url.value.length === 0) {
      this.api.blocks.delete();
    }
  }

  static get isReadOnlySupported() {
    return true;
  }

  onPaste(event) {
    const { key, data: url } = event.detail;
    if (key === 'image') {
      this.data = {
        url,
      };
      this.renderNew();
    }
  }

  renderNew() {
    const oldView = this.container;
    if (oldView) {
      oldView.parentNode.replaceChild(this.render(), oldView);
    }
  }

  static get pasteConfig() {
    return {
      tags: ['IMG'],

      patterns: {
        image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png)$/i,
      },
    };
  }

  static get enableLineBreaks() {
    return true;
  }

  save() {
    if (!this.elements.url?.value || this.error) {
      return undefined;
    }
    return {
      ...this.data,
      url: this.elements.url?.value,
      caption: this.elements.caption?.innerHTML,
    };
  }
}
