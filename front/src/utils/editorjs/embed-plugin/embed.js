import * as Utils from '../utils';

import SERVICES from './services';

import './embed.css';

export default class Embed {
  constructor({ data, api, readOnly }) {
    this.api = api;
    this.data = data;
    this.element = null;
    this.readOnly = readOnly;
    this.elements = [];
  }

  static get toolbox() {
    return {
      title: 'Video',
      icon: '<svg viewBox="64 64 896 896" focusable="false" data-icon="youtube" width="1.5em" height="1.5em" fill="currentColor" aria-hidden="true"><path d="M960 509.2c0-2.2 0-4.7-.1-7.6-.1-8.1-.3-17.2-.5-26.9-.8-27.9-2.2-55.7-4.4-81.9-3-36.1-7.4-66.2-13.4-88.8a139.52 139.52 0 00-98.3-98.5c-28.3-7.6-83.7-12.3-161.7-15.2-37.1-1.4-76.8-2.3-116.5-2.8-13.9-.2-26.8-.3-38.4-.4h-29.4c-11.6.1-24.5.2-38.4.4-39.7.5-79.4 1.4-116.5 2.8-78 3-133.5 7.7-161.7 15.2A139.35 139.35 0 0082.4 304C76.3 326.6 72 356.7 69 392.8c-2.2 26.2-3.6 54-4.4 81.9-.3 9.7-.4 18.8-.5 26.9 0 2.9-.1 5.4-.1 7.6v5.6c0 2.2 0 4.7.1 7.6.1 8.1.3 17.2.5 26.9.8 27.9 2.2 55.7 4.4 81.9 3 36.1 7.4 66.2 13.4 88.8 12.8 47.9 50.4 85.7 98.3 98.5 28.2 7.6 83.7 12.3 161.7 15.2 37.1 1.4 76.8 2.3 116.5 2.8 13.9.2 26.8.3 38.4.4h29.4c11.6-.1 24.5-.2 38.4-.4 39.7-.5 79.4-1.4 116.5-2.8 78-3 133.5-7.7 161.7-15.2 47.9-12.8 85.5-50.5 98.3-98.5 6.1-22.6 10.4-52.7 13.4-88.8 2.2-26.2 3.6-54 4.4-81.9.3-9.7.4-18.8.5-26.9 0-2.9.1-5.4.1-7.6v-5.6zm-72 5.2c0 2.1 0 4.4-.1 7.1-.1 7.8-.3 16.4-.5 25.7-.7 26.6-2.1 53.2-4.2 77.9-2.7 32.2-6.5 58.6-11.2 76.3-6.2 23.1-24.4 41.4-47.4 47.5-21 5.6-73.9 10.1-145.8 12.8-36.4 1.4-75.6 2.3-114.7 2.8-13.7.2-26.4.3-37.8.3h-28.6l-37.8-.3c-39.1-.5-78.2-1.4-114.7-2.8-71.9-2.8-124.9-7.2-145.8-12.8-23-6.2-41.2-24.4-47.4-47.5-4.7-17.7-8.5-44.1-11.2-76.3-2.1-24.7-3.4-51.3-4.2-77.9-.3-9.3-.4-18-.5-25.7 0-2.7-.1-5.1-.1-7.1v-4.8c0-2.1 0-4.4.1-7.1.1-7.8.3-16.4.5-25.7.7-26.6 2.1-53.2 4.2-77.9 2.7-32.2 6.5-58.6 11.2-76.3 6.2-23.1 24.4-41.4 47.4-47.5 21-5.6 73.9-10.1 145.8-12.8 36.4-1.4 75.6-2.3 114.7-2.8 13.7-.2 26.4-.3 37.8-.3h28.6l37.8.3c39.1.5 78.2 1.4 114.7 2.8 71.9 2.8 124.9 7.2 145.8 12.8 23 6.2 41.2 24.4 47.4 47.5 4.7 17.7 8.5 44.1 11.2 76.3 2.1 24.7 3.4 51.3 4.2 77.9.3 9.3.4 18 .5 25.7 0 2.7.1 5.1.1 7.1v4.8zM423 646l232-135-232-133z"></path></svg>',
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

    const inputUrl = Utils.createInput({
      wrapper: this,
      name: 'url',
      placeholder: 'Input video url',
      classList: [this.CSS.input, this.CSS.urlInput],
    });
    inputUrl.addEventListener('input', this.inputUrlChange.bind(this));

    const content = document.createElement('div');
    this.content = content;
    content.classList.add(this.CSS.content);

    const inputCaption = Utils.createInput({
      wrapper: this,
      name: 'caption',
      placeholder: 'Input video caption',
      classList: [this.CSS.input],
    });
    this.inputCaption = inputCaption;

    inputCaption.style.display = 'none';

    if (this.data.inputUrl) {
      inputUrl.value = this.data.inputUrl ?? '';
      inputCaption.value = this.data.caption ?? '';
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
      caption: this.elements.caption?.value,
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
