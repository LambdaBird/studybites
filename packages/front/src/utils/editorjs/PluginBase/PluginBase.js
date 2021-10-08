import './PluginBase.css';

export default class PluginBase {
  constructor({ title = '', hint = '' }) {
    this.titleWrapper = document.createElement('div');
    this.titleWrapper.classList.add('plugin-base__titleWrapper');

    this.title = document.createElement('span');
    this.title.innerText = title;
    this.title.classList.add('plugin-base__text');

    this.hint = document.createElement('span');
    this.hint.innerText = hint;
    this.hint.classList.add('plugin-base__text');

    this.titleWrapper.appendChild(this.title);
    this.titleWrapper.appendChild(this.hint);
  }
}
