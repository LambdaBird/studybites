import * as Utils from '../utils';

import './closedQuestion.css';

const MAX_ANSWER_LENGTH = 50;

export default class ClosedQuestion {
  constructor({ data, api, readOnly }) {
    this.api = api;
    this.data = data;
    this.readOnly = readOnly;
    this.container = null;
    this.elements = [];
    this.answers = ['Example'];
  }

  static get toolbox() {
    return {
      title: 'Closed Question',
      icon: '<svg width="15" height="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zm0-2.394a5.106 5.106 0 1 0 0-10.212 5.106 5.106 0 0 0 0 10.212zm-.675-4.665l2.708-2.708 1.392 1.392-2.708 2.708-1.392 1.391-2.971-2.971L5.245 6.36l1.58 1.58z"/></svg>',
    };
  }

  get CSS() {
    return {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      container: 'closed-question-tool',
      questionInput: 'closed-question-tool__question-input',
      answerInput: 'closed-question-tool__answer-input',
      answerTag: 'closed-question-tool__answer-tag',
      answerWrapper: 'closed-question-tool__answer-wrapper',
      answerRemove: 'closed-question-tool__answer-remove',
      tooltip: 'closed-question-tool__tooltip',
      tooltipText: 'closed-question-tool__tooltipText',
    };
  }

  render() {
    const container = document.createElement('div');
    this.container = container;
    container.classList.add(this.CSS.container);

    const questionInput = Utils.createInput({
      wrapper: this,
      name: 'questionInput',
      placeholder: 'Input your question',
      classList: [this.CSS.input, this.CSS.questionInput],
    });

    if (this.data.question) {
      questionInput.value = this.data.question;
    }

    const answerInput = Utils.createInput({
      wrapper: this,
      name: 'answerInput',
      placeholder: 'Input your answer',
      classList: [this.CSS.input, this.CSS.answerInput],
    });

    const answerWrapper = document.createElement('div');
    this.elements.answerWrapper = answerWrapper;
    answerWrapper.classList.add(this.CSS.answerWrapper);
    answerWrapper.innerText = 'Answers: ';

    if (this.data.answers) {
      this.answers = this.data.answers;
    }

    this.renderTags();

    answerInput.addEventListener(
      'keydown',
      (event) => {
        // KeyCode enter
        if (event.keyCode === 13) {
          this.enterPressed(event);
        }
      },
      false,
    );

    container.appendChild(questionInput);
    container.appendChild(answerInput);
    container.appendChild(answerWrapper);

    return container;
  }

  static get isReadOnlySupported() {
    return true;
  }

  renderTags() {
    const answerTags = this.answers.map((text) => this.createTag(text));
    const spans = Array.from(this.elements.answerWrapper.childNodes).filter(
      (x) => x.tagName === 'SPAN',
    );
    spans.forEach((span) => {
      span.remove();
    });
    answerTags.forEach((answerTag) => {
      this.elements.answerWrapper.appendChild(answerTag);
      answerTag
        .querySelector(`.${this.CSS.answerRemove}`)
        .addEventListener('click', () => {
          this.removeTag(answerTag);
        });
    });
    if (answerTags.length === 0) {
      const noneText = document.createElement('span');
      noneText.innerText = 'none';
      this.elements.answerWrapper.appendChild(noneText);
    }
  }

  removeTag(tag) {
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
    this.renderTags();
  }

  renderNew(renderParams) {
    const oldView = this.container;
    if (oldView) {
      oldView.parentNode.replaceChild(this.render(renderParams), oldView);
    }
  }

  enterPressed(event) {
    event.preventDefault();
    const value = this.elements?.answerInput?.value;
    if (
      value &&
      !this.answers.find(
        (answer) =>
          answer?.trim()?.toLowerCase() === value.trim()?.toLowerCase(),
      )
    ) {
      this.answers.push(value);
      this.renderTags();
    }
    this.elements.answerInput.value = '';
  }

  createTag(text) {
    const wrapper = document.createElement('span');
    wrapper.classList.add(this.CSS.answerTag);
    let displayText = Utils.createElementFromHTML(`<span>${text}</span>`);
    if (text.length > MAX_ANSWER_LENGTH) {
      const textDiv = document.createElement('div');
      textDiv.innerText = text;
      displayText = document.createElement('div');
      displayText.classList.add(this.CSS.tooltip);
      const textSpan = document.createElement('span');
      textSpan.innerText = `${text.slice(0, MAX_ANSWER_LENGTH)}...`;
      const tooltiptext = document.createElement('div');
      tooltiptext.classList.add(this.CSS.tooltipText);
      tooltiptext.innerText = text;

      displayText.appendChild(textSpan);
      displayText.appendChild(tooltiptext);
    }

    const removeSpan =
      Utils.createElementFromHTML(`<span class="${this.CSS.answerRemove}">
       <svg viewBox="64 64 896 896" focusable="false" data-icon="close" width="10px" height="10px" fill="currentColor" aria-hidden="true">
        <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
       </svg>
      </span>
    `);
    wrapper.appendChild(displayText);
    wrapper.appendChild(removeSpan);
    return wrapper;
  }

  static get enableLineBreaks() {
    return true;
  }

  save() {
    const questionInput = this.elements?.questionInput?.value;
    const { answers } = this;
    if (!questionInput || answers?.length === 0) {
      return undefined;
    }
    return {
      question: questionInput,
      answers,
    };
  }
}
