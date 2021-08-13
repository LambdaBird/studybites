import * as Utils from '../utils';

import './image.css';

export default class Image {
  constructor({ data, api, readOnly }) {
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
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
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
    if (this.data === null) {
      return null;
    }

    const container = document.createElement('div');
    this.container = container;
    container.classList.add(this.CSS.container);

    const inputUrl = Utils.createInput({
      wrapper: this,
      name: 'url',
      placeholder: 'Input image url',
      classList: [this.CSS.input, this.CSS.urlInput],
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
    inputCaption.contentEditable = 'true';
    inputCaption.setAttribute('placeholder', 'Input image caption');

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
