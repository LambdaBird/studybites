import { sanitizeBlocks } from '@sb-ui/utils/editorjs/utils';

import PluginBase from '../PluginBase';

import { enterIcon, icon, removeIcon } from './resources';

import './bricks.css';

const MAX_ANSWER_LENGTH = 50;

function createElementFromHTML(htmlString) {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

export default class Bricks extends PluginBase {
  constructor({ data, api, readOnly }) {
    super({
      title: api.i18n.t('title'),
      hint: api.i18n.t('hint'),
    });

    this.api = api;
    this.data = data;
    this.readOnly = readOnly;
    this.elements = {};
    this.answers = this.data.answers || [];
    this.words = this.data.words || [];
  }

  static get toolbox() {
    return {
      title: 'Bricks',
      icon,
    };
  }

  get CSS() {
    return {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      container: 'bricks-tool',
      inputWrapper: 'bricks-tool__input-wrapper',
      inputEnterButton: 'bricks-tool__input-enter-button',
      questionInput: 'bricks-tool__question-input',
      answerTag: 'bricks-tool__answer-tag',
      tagsWrapper: 'bricks-tool__tags-wrapper',
      answerRemove: 'bricks-tool__answer-remove',
      tooltip: 'bricks-tool__tooltip',
      tooltipText: 'bricks-tool__tooltipText',
      additionalInputWrapper: 'bricks-tool__additional-input-wrapper',
      hint: 'bricks-tool__hint',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  renderTags() {
    const words = [...new Set([...this.answers, ...this.words])];
    const answerTags = words.map((text) => this.createTag({ text }));
    const spans = Array.from(this.elements.tagsWrapper.childNodes).filter(
      (x) => x.tagName === 'SPAN',
    );
    spans.forEach((span) => {
      span.remove();
    });
    answerTags.forEach((answerTag) => {
      this.elements.tagsWrapper.appendChild(answerTag);
      answerTag
        .querySelector(`.${this.CSS.answerRemove}`)
        .addEventListener('click', () => {
          this.removeTag({ tag: answerTag });
        });
    });
  }

  removeTag({ tag }) {
    const filteredAnswers = this.answers.filter((answer) => {
      const tagValue =
        tag.querySelector(`.${this.CSS.tooltipText}`)?.innerHTML ||
        tag?.innerText?.trim();
      return answer !== tagValue;
    });
    if (this.answers) {
      this.answers = filteredAnswers;
    }
    if (this.data.answers) {
      this.data.answers = filteredAnswers;
    }
    const filteredWords = this.words.filter((answer) => {
      const tagValue =
        tag.querySelector(`.${this.CSS.tooltipText}`)?.innerHTML ||
        tag?.innerText?.trim();
      return answer !== tagValue;
    });
    if (this.words) {
      this.words = filteredWords;
    }
    if (this.data.words) {
      this.data.words = filteredWords;
    }
    this.renderTags();
  }

  handleEnterAnswer({ event }) {
    event?.preventDefault?.();
    const value = this.elements?.answerInput?.value;
    if (
      value &&
      !this.answers.find(
        (answer) =>
          answer?.trim()?.toLowerCase() === value.trim()?.toLowerCase(),
      )
    ) {
      this.answers.push(value.trim());
      this.words.push(value.trim());
      this.renderTags();
    }
    this.elements.answerInput.value = '';
  }

  handleEnterWord({ event }) {
    event?.preventDefault?.();
    const value = this.elements?.additionalInput?.value;
    if (
      value &&
      !this.words.find(
        (answer) =>
          answer?.trim()?.toLowerCase() === value.trim()?.toLowerCase(),
      )
    ) {
      this.words.push(value.trim());
      this.renderTags();
    }
    this.elements.additionalInput.value = '';
  }

  createTag({ text }) {
    const wrapper = document.createElement('span');
    wrapper.classList.add(this.CSS.answerTag);

    let displayText = createElementFromHTML(`<span>${text}</span>`);
    if (text.length > MAX_ANSWER_LENGTH) {
      const textDiv = document.createElement('div');
      textDiv.innerText = text;

      displayText = document.createElement('div');
      displayText.classList.add(this.CSS.tooltip);

      const textSpan = document.createElement('span');
      textSpan.innerText = `${text.slice(0, MAX_ANSWER_LENGTH)}...`;

      const tooltipText = document.createElement('div');
      tooltipText.classList.add(this.CSS.tooltipText);
      tooltipText.innerText = text;

      displayText.appendChild(textSpan);
      displayText.appendChild(tooltipText);
    }

    const removeSpan = createElementFromHTML(removeIcon(this.CSS.answerRemove));

    wrapper.appendChild(displayText);
    wrapper.appendChild(removeSpan);

    return wrapper;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get sanitize() {
    return {
      div: true,
      br: true,
      ...sanitizeBlocks,
    };
  }

  save() {
    const question = this.elements.questionInput.innerHTML;
    const { answers, words } = this;

    if (!question || !answers?.length) {
      return undefined;
    }
    return {
      question,
      answers,
      words,
    };
  }

  createWordsInput({ name, className, placeholderKey, handleEnter }) {
    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add(this.CSS.inputWrapper);
    if (className) {
      inputWrapper.classList.add(className);
    }
    const input = document.createElement('input');
    this.elements[name] = input;
    input.classList.add(this.CSS.input);
    input.placeholder = this.api.i18n.t(placeholderKey);

    input.onkeydown = (event) => {
      if (event.key === 'Enter') {
        handleEnter({ event });
      }
    };

    const enterButton = document.createElement('div');
    enterButton.classList.add(this.CSS.inputEnterButton);
    enterButton.innerHTML = enterIcon;
    enterButton.addEventListener('click', () => {
      handleEnter({});
    });
    inputWrapper.appendChild(input);
    inputWrapper.appendChild(enterButton);
    return inputWrapper;
  }

  backspacePressed(event) {
    event.stopPropagation();
    if (this.elements.questionInput.innerText.trim().length === 0) {
      this.api.blocks.delete();
    }
  }

  render() {
    const container = document.createElement('div');
    container.classList.add(this.CSS.container);

    this.elements.questionInput = document.createElement('div');
    this.elements.questionInput.classList.add(this.CSS.input);
    this.elements.questionInput.classList.add(this.CSS.questionInput);
    this.elements.questionInput.contentEditable = 'true';
    this.elements.questionInput.setAttribute(
      'placeholder',
      this.api.i18n.t('question'),
    );

    if (this.data.question) {
      this.elements.questionInput.innerHTML = this.data.question;
    }

    const answerInputWrapper = this.createWordsInput({
      name: 'answerInput',
      placeholderKey: 'answer',
      handleEnter: this.handleEnterAnswer.bind(this),
    });

    this.elements.tagsWrapper = document.createElement('div');
    this.elements.tagsWrapper.classList.add(this.CSS.tagsWrapper);

    this.renderTags();

    const additionalInputWrapper = this.createWordsInput({
      name: 'additionalInput',
      className: this.CSS.additionalInputWrapper,
      placeholderKey: 'additional',
      handleEnter: this.handleEnterWord.bind(this),
    });

    container.appendChild(this.titleWrapper);
    container.appendChild(this.elements.questionInput);
    container.appendChild(answerInputWrapper);
    container.appendChild(this.elements.tagsWrapper);
    container.appendChild(additionalInputWrapper);

    this.elements.questionInput.addEventListener('keydown', (event) => {
      if (event.code === 'Backspace') {
        this.backspacePressed(event);
      }
    });

    return container;
  }
}
