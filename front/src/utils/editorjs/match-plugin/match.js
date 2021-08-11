import * as Utils from '../utils';

import './match.css';

export default class Match {
  constructor({ data, api, readOnly }) {
    this.api = api;
    this.data = data;
    this.readOnly = readOnly;
    this.container = null;
    this.inputsWrapper = null;
  }

  static get toolbox() {
    return {
      title: 'Match',
      icon: '<svg width="15" height="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zm0-2.394a5.106 5.106 0 1 0 0-10.212 5.106 5.106 0 0 0 0 10.212zm-.675-4.665l2.708-2.708 1.392 1.392-2.708 2.708-1.392 1.391-2.971-2.971L5.245 6.36l1.58 1.58z"/></svg>',
    };
  }

  get CSS() {
    return {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      container: 'match-tool',
      inputsWrapper: 'match-tool__inputsWrapper',
      hint: 'match-tool__hint',
      addLineButton: 'match-tool__addLineButton',
      matchLine: 'match-tool__line',
    };
  }

  render() {
    const container = document.createElement('div');
    this.container = container;
    container.classList.add(this.CSS.container);

    const hint = document.createElement('span');
    hint.innerText = '* Words will be shuffled for students after save';
    hint.classList.add(this.CSS.hint);

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
      this.data.values.forEach(({ from, to }, index) => {
        inputsWrapper.appendChild(
          this.createBlockLine({
            number: index + 1,
            from,
            to,
          }),
        );
      });
    } else {
      const blockLine = this.createBlockLine({});
      inputsWrapper.appendChild(blockLine);
    }

    container.appendChild(hint);
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
      <button type="button" class="ant-btn ant-btn-link ${this.CSS.addLineButton}">
        <span  role="img" aria-label="plus" class="anticon anticon-plus">
          <svg viewBox="64 64 896 896" focusable="false" data-icon="plus" width="1em" height="1em" fill="currentColor"
          aria-hidden="true"><defs><style></style></defs><path
          d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path><path
          d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"></path>
          </svg>
        </span>
        <span>Add line</span>
      </button>`);
  }

  createBlockLine({ number = 1, from = '', to = '' }) {
    const wrapper = document.createElement('div');
    wrapper.classList.add(this.CSS.matchLine);
    const numberElement = document.createElement('div');
    numberElement.innerText = `${number}.`;
    const firstInput = document.createElement('div');
    firstInput.classList.add(this.CSS.input);
    firstInput.innerHTML = from;
    if (!this.readOnly) {
      firstInput.contentEditable = 'true';
    }
    firstInput.setAttribute('placeholder', 'Input your left value');
    const secondInput = document.createElement('div');
    secondInput.classList.add(this.CSS.input);
    secondInput.innerHTML = to;
    if (!this.readOnly) {
      secondInput.contentEditable = 'true';
    }
    secondInput.setAttribute('placeholder', 'Input your right value');

    wrapper.appendChild(numberElement);
    wrapper.appendChild(firstInput);
    wrapper.appendChild(secondInput);
    this.prepareInputs();
    return wrapper;
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get enableLineBreaks() {
    return true;
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
      const x = Array.from(line?.childNodes);
      const [from, to] = [x[1], x[2]];
      return {
        from: from?.innerHTML,
        to: to?.innerHTML,
      };
    });
  }

  save() {
    const inputsValue = this.prepareInputs().filter(
      ({ from, to }) => from.length !== 0 || to.length !== 0,
    );
    if (inputsValue.length === 0) {
      return null;
    }
    return {
      values: inputsValue,
    };
  }
}
