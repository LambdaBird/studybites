import PluginBase from '../PluginBase';
import * as Utils from '../utils';

import { createRemoveIcon, icon } from './resources';

import './closedQuestion.css';

const MAX_ANSWER_LENGTH = 50;

export default class ClosedQuestion extends PluginBase {
  constructor({ data, api, readOnly }) {
    super({
      title: api.i18n.t('title'),
    });

    this.api = api;
    this.data = data;
    this.readOnly = readOnly;
    this.container = null;
    this.elements = [];
    this.answers = [this.api.i18n.t('example')];
  }

  static get toolbox() {
    return {
      title: 'Closed Question',
      icon,
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
    container.appendChild(this.titleWrapper);

    const questionInput = document.createElement('div');
    questionInput.classList.add(this.CSS.input);
    questionInput.classList.add(this.CSS.questionInput);
    if (!this.readOnly) {
      questionInput.contentEditable = 'true';
    }
    questionInput.setAttribute('placeholder', this.api.i18n.t('question'));
    this.elements.questionInput = questionInput;

    if (this.data.question) {
      questionInput.innerHTML = this.data.question;
    }

    const answerInput = Utils.createInput({
      wrapper: this,
      name: 'answerInput',
      placeholder: this.api.i18n.t('answer'),
      classList: [this.CSS.input, this.CSS.answerInput],
      readOnly: this.readOnly,
    });

    const explanationInput = Utils.createInput({
      wrapper: this,
      name: 'explanationInput',
      placeholder: this.api.i18n.t('explanation'),
      classList: [this.CSS.input, this.CSS.answerInput],
      readOnly: this.readOnly,
    });
    if (this.data.explanation) {
      explanationInput.value = this.data.explanation;
    }

    const answerWrapper = document.createElement('div');
    this.elements.answerWrapper = answerWrapper;
    answerWrapper.classList.add(this.CSS.answerWrapper);
    answerWrapper.innerText = this.api.i18n.t('tag_title');

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

    questionInput.addEventListener('keydown', (event) => {
      if (event.code === 'Backspace') {
        this.backspaceQuestionPressed(event);
      }
    });

    container.appendChild(questionInput);
    container.appendChild(answerInput);
    container.appendChild(explanationInput);
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
      noneText.innerText = this.api.i18n.t('none');
      this.elements.answerWrapper.appendChild(noneText);
    }
  }

  removeTag(tag) {
    if (this.readOnly) {
      return;
    }
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
      this.answers.push(value.trim());
      this.renderTags();
    }
    this.elements.answerInput.value = '';
  }

  backspaceQuestionPressed(event) {
    event.stopPropagation();
    if (this.elements.questionInput.innerText.trim().length === 0) {
      this.api.blocks.delete();
    }
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

    const removeSpan = Utils.createElementFromHTML(
      createRemoveIcon(this.CSS.answerRemove),
    );
    wrapper.appendChild(displayText);
    wrapper.appendChild(removeSpan);
    return wrapper;
  }

  static get enableLineBreaks() {
    return true;
  }

  save() {
    const question = this.elements?.questionInput?.innerHTML;
    const explanation = this.elements?.explanationInput?.value;
    const { answers } = this;
    if (!question || answers?.length === 0) {
      return null;
    }
    return {
      question,
      explanation,
      answers,
    };
  }
}
