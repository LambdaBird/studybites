/* eslint-disable class-methods-use-this */

import {
  extractContentAfterCaret,
  fragmentToHtml,
  getHTML,
  make,
  moveCaret,
} from './utils';

import './quiz.css';

export default class Quiz {
  constructor({ data, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;

    this.elements = {
      wrapper: null,
      question: null,
      answers: [],
    };
    this.data = data || {};
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      icon: '<svg width="15" height="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zm0-2.394a5.106 5.106 0 1 0 0-10.212 5.106 5.106 0 0 0 0 10.212zm-.675-4.665l2.708-2.708 1.392 1.392-2.708 2.708-1.392 1.391-2.971-2.971L5.245 6.36l1.58 1.58z"/></svg>',
      title: 'Quiz',
    };
  }

  static get enableLineBreaks() {
    return true;
  }

  get CSS() {
    return {
      baseClass: 'quiz-tool__base',
      questionWrapper: 'quiz-tool__wrapper-question',
      question: 'quiz-tool__question',
      wrapper: 'quiz-tool__wrapper',

      item: 'quiz-tool__item',
      itemChecked: 'quiz-tool__item--checked',
      checkbox: 'quiz-tool__item-checkbox',
      textField: 'quiz-tool__item-text',
    };
  }

  render() {
    const { answers, question } = this.data;
    this.elements.wrapper = document.createElement('div');
    this.elements.wrapper.classList.add(this.CSS.wrapper);

    this.elements.question = document.createElement('span');

    const questionInput = document.createElement('input');
    questionInput.classList.add(this.CSS.question);
    questionInput.placeholder = this.api.i18n.t('question');
    questionInput.type = 'text';
    questionInput.classList.add('ant-input');
    questionInput.addEventListener('focusin', () => {
      questionInput.classList.add('ant-input-affix-wrapper-focused');
    });
    questionInput.addEventListener('focusout', () => {
      questionInput.classList.remove('ant-input-affix-wrapper-focused');
    });
    this.elements.question.appendChild(questionInput);
    this.elements.question.classList.add('ant-input-affix-wrapper');
    this.elements.question.classList.add('quiz-tool__wrapper-question');

    this.elements.question.placeholder = this.api.i18n.t('question');
    if (question) {
      questionInput.value = question;
    }

    this.elements.wrapper.appendChild(this.elements.question);

    if (answers?.length > 0) {
      const answersItems = answers.map(({ value, correct }) =>
        this.createChecklistItem({
          value,
          correct,
        }),
      );
      answersItems.forEach((answersItem) => {
        this.elements.answers.push(answersItem);
      });
    } else {
      const firstAnswer = this.createChecklistItem({
        value: '',
        correct: false,
      });

      this.elements.answers.push(firstAnswer);
    }

    this.elements.answers.forEach((answerWrap) => {
      this.elements.wrapper.appendChild(answerWrap);
    });

    this.elements.wrapper.addEventListener(
      'keydown',
      (event) => {
        const [ENTER, BACKSPACE] = [13, 8];
        if (event.keyCode === ENTER) {
          this.enterPressed(event);
        } else if (event.keyCode === BACKSPACE) {
          this.backspace(event);
        }
      },
      false,
    );

    this.api.listeners.on(
      this.elements.wrapper,
      'click',
      (e) => this.toggleCheckbox(e),
      false,
    );

    return this.elements.wrapper;
  }

  toggleCheckbox(event) {
    const { target } = event;
    if (target.classList.contains(this.CSS.checkbox)) {
      target.classList.toggle(this.CSS.itemChecked);
    }
  }

  createChecklistItem(item = {}) {
    const checkListItem = make('div', this.CSS.item);
    const checkbox = make('span', this.CSS.checkbox);
    const textField = make('div', this.CSS.textField, {
      innerHTML: item.value ? item.value : '',
      contentEditable: !this.readOnly,
    });
    textField.setAttribute('placeholder', this.api.i18n.t('answer'));

    if (item.correct) {
      checkbox.classList.add(this.CSS.itemChecked);
    }

    checkListItem.appendChild(checkbox);
    checkListItem.appendChild(textField);

    return checkListItem;
  }

  enterPressed(event) {
    event.preventDefault();

    const { items } = this;
    const currentItem = document.activeElement.closest(`.${this.CSS.item}`);
    if (event.target.classList.contains(this.CSS.question)) {
      return;
    }

    const currentItemIndex = items.indexOf(currentItem);
    const isLastItem = currentItemIndex === items.length - 1;
    if (isLastItem) {
      const currentItemText = getHTML(this.getItemInput(currentItem));
      const isEmptyItem = currentItemText.length === 0;
      if (isEmptyItem) {
        const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();
        currentItem.remove();
        this.api.blocks.insert();
        this.api.caret.setToBlock(currentBlockIndex + 1);
        return;
      }
    }
    const fragmentAfterCaret = extractContentAfterCaret();
    const htmlAfterCaret = fragmentToHtml(fragmentAfterCaret);
    const newItem = this.createChecklistItem({
      text: htmlAfterCaret,
      checked: false,
    });
    this.elements.wrapper.insertBefore(newItem, currentItem.nextSibling);
    moveCaret(this.getItemInput(newItem), true);
  }

  backspace(event) {
    const currentItem = event.target.closest(`.${this.CSS.item}`);
    const currentIndex = this.items.indexOf(currentItem);
    const prevItem = this.items[currentIndex - 1];
    if (!prevItem) {
      return;
    }
    const selection = window.getSelection();
    const caretAtTheBeginning = selection.focusOffset === 0;
    if (!caretAtTheBeginning) {
      return;
    }

    event.preventDefault();
    if (prevItem.classList.contains(this.CSS.questionWrapper)) {
      if (this.items.length === 2) {
        this.api.blocks.delete(this.api.blocks.getCurrentBlockIndex());
      }
    } else {
      const fragmentAfterCaret = extractContentAfterCaret();
      const prevItemInput = this.getItemInput(prevItem);
      const prevItemChildNodesLength = prevItemInput.childNodes.length;

      prevItemInput.appendChild(fragmentAfterCaret);

      moveCaret(prevItemInput, undefined, prevItemChildNodesLength);

      currentItem.remove();
    }
  }

  getItemInput(el) {
    return el.querySelector(`.${this.CSS.textField}`);
  }

  getItemChecked(el) {
    return el
      .querySelector(`.${this.CSS.checkbox}`)
      .classList.contains(this.CSS.itemChecked);
  }

  get items() {
    return Array.from(this.elements.wrapper.childNodes);
  }

  save() {
    const question = this.items[0].querySelector(`.${this.CSS.question}`);
    const answers = this.items.slice(1).map((answerItem) => ({
      value: this.getItemInput(answerItem).innerText,
      correct: this.getItemChecked(answerItem),
    }));
    return {
      question: question.value,
      answers,
    };
  }
}
