/* eslint-disable class-methods-use-this */
import './next.css';

export default class Next {
  constructor({ api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      title: 'Next',
      icon: `<svg width="32" height="32" viewBox="0 -34 137 196" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M111.686 61.5645H21.3138C20.7293 61.5645 20.2617 62.032 20.2617 62.6035V70.3965C20.2617 70.968 20.7293 71.4355 21.3138 71.4355H111.686C112.271 71.4355 112.738 70.968 112.738 70.3965V62.6035C112.738 62.032 112.271 61.5645 111.686 61.5645ZM65.7597 51.8622C66.1363 52.3428 66.8637 52.3428 67.2273 51.8622L80.3195 35.3021C80.8001 34.6917 80.3715 33.7825 79.5792 33.7825H71.4355V13.5078C71.4355 12.9363 70.968 12.4688 70.3965 12.4688H62.6035C62.032 12.4688 61.5645 12.9363 61.5645 13.5078V33.7695H53.4078C52.6285 33.7695 52.1869 34.6787 52.6675 35.2892L65.7597 51.8622V51.8622ZM67.2403 81.1378C67.1537 81.0256 67.0425 80.9348 66.9153 80.8724C66.7881 80.8099 66.6482 80.7774 66.5065 80.7774C66.3648 80.7774 66.2249 80.8099 66.0977 80.8724C65.9705 80.9348 65.8593 81.0256 65.7727 81.1378L52.6805 97.7108C52.5714 97.8495 52.5036 98.0161 52.4848 98.1915C52.466 98.3669 52.4971 98.5441 52.5743 98.7027C52.6516 98.8613 52.772 98.9949 52.9217 99.0883C53.0714 99.1816 53.2444 99.2309 53.4208 99.2305H61.5645V119.492C61.5645 120.064 62.032 120.531 62.6035 120.531H70.3965C70.968 120.531 71.4355 120.064 71.4355 119.492V99.2305H79.5922C80.3715 99.2305 80.8131 98.3213 80.3325 97.7108L67.2403 81.1378V81.1378Z" />
      </svg>
      `,
    };
  }

  get CSS() {
    return {
      baseClass: 'next-tool__base',
    };
  }

  render() {
    const wrapper = document.createElement('div');

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
