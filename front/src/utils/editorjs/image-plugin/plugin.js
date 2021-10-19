import { allowedImageTypes } from '@sb-ui/utils/constants';
import { isBackspaceValid } from '@sb-ui/utils/editorjs/toolsHelper';

import { uploadFile } from '../utils';

import { ToolboxIcon } from './resources';

import './index.css';

const MAX_NAME_LENGTH = 50;

const createElement = ({
  tagName = 'div',
  classList = [],
  children = [],
  attrs,
} = {}) => {
  const element = document.createElement(tagName);

  if (classList.length) {
    element.classList.add(...classList);
  }
  if (children.length) {
    children.forEach((child) => element.appendChild(child));
  }
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      element[key] = value;
    });
  }

  return element;
};

export default class Image {
  constructor({ data, config, api, readOnly }) {
    this.data = data;
    this.config = config;
    this.api = api;
    this.readOnly = readOnly;

    this.nodes = {
      container: null,
      fileInput: null,
      fileLabel: null,
      linkInput: null,
      contentDisplay: null,
      caption: null,
    };
    this.error = false;
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      icon: ToolboxIcon,
      title: 'Image',
    };
  }

  get CSS() {
    return {
      container: 'image-plugin__container',
      title: 'image-plugin__title',
      fileInput: 'image-plugin__fileInput',
      file: 'image-plugin__file',
      input: this.api.styles.input,
      contentDisplay: 'image-plugin__contentDisplay',
    };
  }

  isFile = () => !!(this.nodes.fileInput.value || this.nodes.linkInput.value);

  save = () =>
    this.data.location && !this.error
      ? {
          location: this.data.location,
          caption: this.data.caption,
        }
      : null;

  onFileSelect = async () => {
    await uploadFile({
      parent: this.nodes.fileInput,
      config: this.config,
      onSuccess: this.onUploadSuccess,
      onError: this.onError,
    });
  };

  handleLabelClick = () => {
    this.nodes.fileInput.click();
  };

  onUploadSuccess = (response) => {
    this.data = response.data;
    this.nodes.contentDisplay.src = this.data.location;
  };

  onSuccess = () => {
    this.error = false;
    const name = this.data.location;
    this.nodes.fileLabel.innerText =
      name.length > MAX_NAME_LENGTH
        ? `${name.slice(0, MAX_NAME_LENGTH)}...`
        : name;
    if (!this.nodes.caption) {
      this.nodes.container.appendChild(this.createCaption());
    }
    this.nodes.linkInput.value = '';
  };

  onError = () => {
    if (this.isFile() && !this.error) {
      this.error = true;
      this.nodes.contentDisplay.src = '';
      this.nodes.fileLabel.innerText = this.api.i18n.t('error');
      if (this.nodes.caption) {
        this.nodes.container.removeChild(this.nodes.caption);
        this.nodes.caption = null;
      }
    }
  };

  onLinkInput = () => {
    this.data = {
      location: this.nodes.linkInput.value,
    };
    this.nodes.contentDisplay.src = this.nodes.linkInput.value;
  };

  onCaptionInput = () => {
    this.data.caption = this.nodes.caption.innerHTML;
  };

  createPluginTitle() {
    return createElement({
      tagName: 'span',
      classList: [this.CSS.title],
      attrs: {
        innerText: this.api.i18n.t('title'),
      },
    });
  }

  createFileInput() {
    this.nodes.fileInput = createElement({
      tagName: 'input',
      classList: [this.CSS.fileInput],
      attrs: {
        type: 'file',
        accept: allowedImageTypes,
        disabled: this.readOnly || false,
      },
    });
    this.nodes.fileInput.addEventListener('change', this.onFileSelect);
    this.nodes.fileLabel = createElement({
      tagName: 'label',
      attrs: {
        htmlFor: 'file',
        innerText: this.api.i18n.t('select'),
        onclick: this.handleLabelClick,
      },
    });
    return createElement({
      classList: [this.CSS.file],
      children: [this.nodes.fileInput, this.nodes.fileLabel],
    });
  }

  linkKeydown(event) {
    if (isBackspaceValid(event, this.nodes.linkInput.value)) {
      this.api.blocks.delete();
    }
  }

  createLinkInput() {
    this.nodes.linkInput = createElement({
      tagName: 'input',
      classList: [this.CSS.input],
      attrs: {
        placeholder: this.api.i18n.t('input'),
        disabled: this.readOnly || false,
      },
    });
    this.nodes.linkInput.addEventListener('input', this.onLinkInput);
    this.nodes.linkInput.addEventListener(
      'keydown',
      this.linkKeydown.bind(this),
    );
    return createElement({
      children: [this.nodes.linkInput],
    });
  }

  createContentDisplay() {
    this.nodes.contentDisplay = createElement({
      tagName: 'img',
      classList: [this.CSS.contentDisplay],
      attrs: {
        src: this.data.location || '',
      },
    });
    this.nodes.contentDisplay.addEventListener('load', this.onSuccess);
    this.nodes.contentDisplay.addEventListener('error', this.onError);
    return createElement({
      children: [this.nodes.contentDisplay],
    });
  }

  createCaption() {
    this.nodes.caption = createElement({
      tagName: 'div',
      classList: [this.CSS.input],
      attrs: {
        innerHTML: this.data.caption || '',
        disabled: this.readOnly || false,
        contentEditable: this.readOnly ? 'false' : 'true',
      },
    });
    this.nodes.caption.addEventListener('input', this.onCaptionInput);
    this.nodes.caption.setAttribute('placeholder', this.api.i18n.t('caption'));
    return this.nodes.caption;
  }

  render() {
    this.nodes.container = createElement({
      classList: [this.CSS.container],
      children: [
        this.createPluginTitle(),
        this.createFileInput(),
        this.createLinkInput(),
        this.createContentDisplay(),
      ],
    });
    return this.nodes.container;
  }
}
