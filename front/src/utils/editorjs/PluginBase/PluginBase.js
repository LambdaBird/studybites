import './PluginBase.css';

export default class PluginBase {
  constructor({ title = '', hint = '' }) {
    this.titleWrapper = document.createElement('div');
    this.titleWrapper.classList.add('base-plugin__titleWrapper');

    this.title = document.createElement('span');
    this.title.innerText = title;
    this.title.classList.add('base-plugin__text');

    this.hint = document.createElement('span');
    this.hint.innerText = hint;
    this.hint.classList.add('base-plugin__text');

    this.titleWrapper.appendChild(this.title);
    this.titleWrapper.appendChild(this.hint);
  }
}
