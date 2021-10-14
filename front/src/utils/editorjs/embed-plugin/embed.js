import PluginBase from '../PluginBase';
import * as Utils from '../utils';

import { ToolboxIcon } from './resources';
import SERVICES from './services';

import './embed.css';

export default class Embed extends PluginBase {
  constructor({ data, api, readOnly }) {
    super({
      title: api.i18n.t('title'),
    });

    this.api = api;
    this.data = data;
    this.element = null;
    this.readOnly = readOnly;
    this.elements = [];
  }

  static get toolbox() {
    return {
      title: 'Video',
      icon: ToolboxIcon,
    };
  }

  get CSS() {
    return {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      container: 'embed-tool',
      content: 'embed-tool__content',
      caption: 'embed-tool__caption',
      urlInput: 'embed-tool__urlInput',
      videoLoaded: 'embed-tool__video-loaded',
    };
  }

  inputUrlChange() {
    const value = this.elements?.url?.value;
    const service = Object.keys(Embed.patterns).find((x) =>
      Embed.patterns[x].test(value),
    );
    const url = value;
    this.content.classList.remove(this.CSS.videoLoaded);
    const {
      regex,
      embedUrl,
      width,
      height,
      id = (ids) => ids.shift(),
    } = SERVICES?.[service] || {};
    const result = regex?.exec(url)?.slice(1);
    this.isValid = !!result;
    if (result) {
      const embed = embedUrl.replace(/<%= remote_id %>/g, id(result));
      this.data = {
        service,
        source: url,
        embed,
        width,
        height,
      };
      const { html } = SERVICES[this.data.service] || {};
      this.content.innerHTML = html;
      this.content.style.height = `${height}px`;
      this.content.firstChild.onload = () => {
        this.content.classList.add(this.CSS.videoLoaded);
      };
      this.inputCaption.style.display = 'flex';

      this.content.firstChild.setAttribute('src', embed);
    } else {
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
    container.appendChild(this.titleWrapper);

    const inputUrl = Utils.createInput({
      wrapper: this,
      name: 'url',
      placeholder: this.api.i18n.t('input'),
      classList: [this.CSS.input, this.CSS.urlInput],
      readOnly: this.readOnly,
    });
    inputUrl.addEventListener('input', this.inputUrlChange.bind(this));

    const content = document.createElement('div');
    this.content = content;
    content.classList.add(this.CSS.content);

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

    if (this.data.inputUrl) {
      inputUrl.value = this.data.inputUrl ?? '';
      inputCaption.innerHTML = this.data.caption ?? '';
      this.inputUrlChange();
    }

    container.appendChild(inputUrl);
    container.appendChild(content);
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

  save() {
    if (!this.elements.url?.value || !this.isValid) {
      return undefined;
    }
    return {
      ...this.data,
      inputUrl: this.elements.url?.value,
      caption: this.elements.caption?.innerHTML,
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  onPaste(event) {
    const { key: service, data: url } = event.detail;
    const {
      regex,
      embedUrl,
      width,
      height,
      id = (ids) => ids.shift(),
    } = Embed.services[service];
    const result = regex.exec(url).slice(1);
    const embed = embedUrl.replace(/<%= remote_id %>/g, id(result));
    this.data = {
      service,
      source: url,
      embed,
      width,
      height,
      inputUrl: url,
    };
    const oldView = this.container;

    if (oldView) {
      oldView.parentNode.replaceChild(this.render(), oldView);
    }
  }

  static prepare({ config = {} }) {
    const { services = {} } = config;

    let entries = Object.entries(SERVICES);

    const enabledServices = Object.entries(services)
      // eslint-disable-next-line no-unused-vars
      .filter(([key, value]) => typeof value === 'boolean' && value === true)
      .map(([key]) => key);

    const userServices = Object.entries(services)
      // eslint-disable-next-line no-unused-vars
      .filter(([key, value]) => typeof value === 'object')
      // eslint-disable-next-line no-unused-vars
      .filter(([key, service]) => Embed.checkServiceConfig(service))
      .map(([key, service]) => {
        const { regex, embedUrl, html, height, width, id } = service;

        return [
          key,
          {
            regex,
            embedUrl,
            html,
            height,
            width,
            id,
          },
        ];
      });

    if (enabledServices.length) {
      entries = entries.filter(([key]) => enabledServices.includes(key));
    }

    entries = entries.concat(userServices);

    Embed.services = entries.reduce((result, [key, service]) => {
      if (!(key in result)) {
        // eslint-disable-next-line no-param-reassign
        result[key] = service;

        return result;
      }

      // eslint-disable-next-line no-param-reassign
      result[key] = { ...result[key], ...service };

      return result;
    }, {});

    Embed.patterns = entries.reduce((result, [key, item]) => {
      // eslint-disable-next-line no-param-reassign
      result[key] = item.regex;

      return result;
    }, {});
  }

  static get pasteConfig() {
    return {
      patterns: Embed.patterns,
    };
  }
}
