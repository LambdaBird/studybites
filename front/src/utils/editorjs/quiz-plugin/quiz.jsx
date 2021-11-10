import ReactDOM from 'react-dom';

import PluginBase from '../PluginBase';

import QuizComponent from './Quiz';
import { ToolboxIcon } from './resources';

import './quiz.css';

export default class Quiz extends PluginBase {
  constructor({ data, api, readOnly, block }) {
    super({
      title: api.i18n.t('title'),
    });

    this.api = api;
    this.block = block;
    this.readOnly = readOnly;
    this.data = data || {};
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      icon: ToolboxIcon,
      title: 'Quiz',
    };
  }

  static get enableLineBreaks() {
    return true;
  }

  get CSS() {
    return {
      input: this.api.styles.input,
      baseClass: 'quiz-tool__base',
      questionWrapper: 'quiz-tool__wrapper-question',
      question: 'quiz-tool__question',
      wrapper: 'quiz-tool__wrapper',

      itemsWrapper: 'quiz-tool__items--wrapper',
      item: 'quiz-tool__item',
      itemChecked: 'quiz-tool__item--checked',
      checkbox: 'quiz-tool__item-checkbox',
      textField: 'quiz-tool__item-text',
    };
  }

  render() {
    const container = document.createElement('div');
    ReactDOM.render(<QuizComponent tool={this} />, container);
    return container;
  }

  getItemInput(el) {
    return el.querySelector(`.${this.CSS.textField}`);
  }

  getItemChecked(el) {
    return el
      .querySelector(`.${this.CSS.checkbox}`)
      .classList.contains(this.CSS.itemChecked);
  }

  save() {
    const answers = [...this.itemsWrapper.childNodes]
      .map((answerItem) => ({
        value: this.getItemInput(answerItem).innerHTML,
        correct: this.getItemChecked(answerItem),
      }))
      .filter((x) => x.value.trim());
    if (answers.length === 0) {
      return null;
    }
    return {
      question: this.question.innerHTML,
      answers,
    };
  }
}
