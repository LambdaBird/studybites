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
      title: 'Embed',
      icon: '<svg width="17" height="15" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z"/></svg>',
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

      this.content.firstChild.setAttribute('src', embed);
    } else {
      this.content.innerHTML = '';
      this.data = {};
    }
  }

  createInput({ name, placeholder, classList = [] }) {
    const input = document.createElement('input');
    this.elements[name] = input;
    input.placeholder = placeholder;
    input.classList.add(...classList);
    return input;
  }

  render() {
    const container = document.createElement('div');
    this.container = container;
    container.classList.add(this.CSS.container);

    const inputUrl = this.createInput({
      name: 'url',
      placeholder: 'Input url',
      classList: [this.CSS.input, this.CSS.urlInput],
    });
    inputUrl.addEventListener('input', this.inputUrlChange.bind(this));

    const content = document.createElement('div');
    this.content = content;
    content.classList.add(this.CSS.content);

    const inputCaption = this.createInput({
      name: 'caption',
      placeholder: 'Input caption',
      classList: [this.CSS.input],
    });

    if (this.data.inputUrl) {
      inputUrl.value = this.data.inputUrl ?? '';
      inputCaption.value = this.data.caption ?? '';
      this.inputUrlChange();
    }

    container.appendChild(inputUrl);
    container.appendChild(content);
    container.appendChild(inputCaption);

    return container;
  }

  save() {
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
