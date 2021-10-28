import { CDX_INPUT } from '@sb-ui/utils/editorjs/constatnts';
import { deleteIfBackspace } from '@sb-ui/utils/editorjs/toolsHelper';

import PluginBase from '../PluginBase';
import * as Utils from '../utils';

import { icon, plusIcon } from './resources';

import './match.css';

export default class Match extends PluginBase {
  constructor({ data, api, readOnly }) {
    super({
      title: api.i18n.t('title'),
      hint: api.i18n.t('hint'),
    });

    this.api = api;
    this.data = data;
    this.readOnly = readOnly;
    this.container = null;
    this.inputsWrapper = null;
  }

  static get toolbox() {
    return {
      title: 'Match',
      icon,
    };
  }

  get CSS() {
    return {
      baseClass: this.api.styles.block,
      baseInput: this.api.styles.input,
      container: 'match-tool',
      input: 'match-tool__input',
      inputsWrapper: 'match-tool__inputsWrapper',
      addLineButton: 'match-tool__addLineButton',
      matchLine: 'match-tool__line',
    };
  }

  render() {
    const container = document.createElement('div');
    this.container = container;
    container.classList.add(this.CSS.container);
    container.appendChild(this.titleWrapper);

    const addLineButton = this.createAddButton();

    const inputsWrapper = document.createElement('div');
    inputsWrapper.classList.add(this.CSS.inputsWrapper);
    this.inputsWrapper = inputsWrapper;

    if (!this.readOnly) {
      addLineButton.addEventListener('click', () => {
        this.addNewLine();
      });
    }

    if (this.data.values?.length > 0) {
      this.data.values.forEach(({ left, right }, index) => {
        inputsWrapper.appendChild(
          this.createBlockLine({
            number: index + 1,
            left,
            right,
          }),
        );
      });
    } else {
      const firstBlockLine = this.createBlockLine({ number: 1 });
      const secondBlockLine = this.createBlockLine({ number: 2 });
      inputsWrapper.appendChild(firstBlockLine);
      inputsWrapper.appendChild(secondBlockLine);
    }

    container.appendChild(inputsWrapper);
    container.appendChild(addLineButton);

    return container;
  }

  addNewLine() {
    const inputs = this.prepareInputs();
    this.inputsWrapper.appendChild(
      this.createBlockLine({
        number: inputs.length + 1,
      }),
    );
  }

  createAddButton() {
    return Utils.createElementFromHTML(`
      <button type="button" class="ant-btn ant-btn-link ${
        this.CSS.addLineButton
      }">
        <span  role="img" aria-label="plus" class="anticon anticon-plus">
         ${plusIcon}
        </span>
        <span>${this.api.i18n.t('add_line')}</span>
      </button>`);
  }

  createInput(value, placeholderKey) {
    const input = document.createElement('div');
    input.classList.add(this.CSS.baseInput, this.CSS.input);
    input.innerHTML = value;
    if (!this.readOnly) {
      input.contentEditable = 'true';
    }
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace') {
        this.backspacePressed(event);
      }
    });
    input.setAttribute('placeholder', this.api.i18n.t(placeholderKey));
    return input;
  }

  createBlockLine({ number = 1, left = '', right = '' }) {
    const wrapper = document.createElement('div');
    wrapper.classList.add(this.CSS.matchLine);

    const numberElement = document.createElement('div');
    numberElement.innerText = `${number}.`;

    const leftInput = this.createInput(left, 'input_left_placeholder');
    const rightInput = this.createInput(right, 'input_right_placeholder');

    wrapper.appendChild(numberElement);
    wrapper.appendChild(leftInput);
    wrapper.appendChild(rightInput);
    this.prepareInputs();
    return wrapper;
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get sanitize() {
    return {
      div: true,
      br: true,
    };
  }

  renderNew(renderParams) {
    const oldView = this.container;
    if (oldView) {
      oldView.parentNode.replaceChild(this.render(renderParams), oldView);
    }
  }

  prepareInputs() {
    const lines = Array.from(this.inputsWrapper?.childNodes);
    return lines.map((line) => {
      const [, left, right] = [...Array.from(line?.childNodes)];
      return {
        left: left?.innerHTML,
        right: right?.innerHTML,
      };
    });
  }

  backspacePressed(event) {
    deleteIfBackspace({
      event,
      api: this.api,
      element: event.target,
      elements: [...this.inputsWrapper.querySelectorAll(`.${CDX_INPUT}`)],
    });
  }

  save() {
    const inputsValue = this.prepareInputs().filter(
      ({ left, right }, index) =>
        left.trim().length !== 0 || right.trim().length !== 0 || index <= 1,
    );
    if (
      inputsValue.length === 0 ||
      inputsValue.every(
        ({ left, right }) =>
          left.trim().length === 0 && right.trim().length === 0,
      )
    ) {
      return null;
    }
    return {
      values: inputsValue,
    };
  }
}
