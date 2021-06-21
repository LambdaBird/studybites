/* eslint-disable class-methods-use-this */
// eslint-disable-next-line no-unused-vars
import nextStyle from './next.css';

export default class Next {
  static get toolbox() {
    return {
      title: 'Next',
      icon: `<svg height="14" width="12"><text font-size='1.5em' x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">N</text></svg>
 `,
    };
  }

  get CSS() {
    return {
      baseClass: 'next-tool__base',
    };
  }

  render() {
    const button = document.createElement('button');
    button.classList.add(this.CSS.baseClass);
    button.innerText = 'Next';
    return button;
  }

  save() {
    return {};
  }
}
