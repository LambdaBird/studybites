import { stripHTML } from '@sb-ui/utils/editorjs/utils';

import PluginBase from '../PluginBase';

import { icon } from './resources';

import './fillTheGap.css';

export default class FillTheGap extends PluginBase {
  constructor({ data, api, readOnly }) {
    super({
      title: api.i18n.t('title'),
      hint: `${api.i18n.t('hint_part_one')}{{ }}${api.i18n.t('hint_part_two')}`,
    });

    this.data = data;
    this.api = api;
    this.readOnly = readOnly;
    this.bracketsRegexp = /\{{(.*?)\}}/g;
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get toolbox() {
    return {
      icon,
      title: 'Fill the gap',
    };
  }

  get CSS() {
    return {
      container: 'ftg-tool',
      input: this.api.styles.input,
    };
  }

  save = () => {
    const inputHTML = this.input.innerHTML;
    const regexpMatches = inputHTML.match(this.bracketsRegexp);
    if (inputHTML.trim().length === 0) {
      return undefined;
    }

    const answers = regexpMatches
      ?.map((match) => stripHTML(match))
      ?.map((match) =>
        match.replace('{{', '').replace('}}', '').trim().split(','),
      )
      ?.map((phrases) => phrases.map((phrase) => phrase.trim()))
      ?.map((answer) => [...new Set([...answer])]);

    const text = inputHTML.replace(this.bracketsRegexp, '{{ # }}');
    const tokens = text.split('{{ # }}');
    const tokensData = tokens.reduce((prev, token, index) => {
      const answer = answers?.[index];
      const tokenData = [
        ...prev,
        { value: token, id: prev.length + 1, type: 'text' },
      ];
      if (answer && answer.length > 0) {
        tokenData.push({ value: answer, id: prev.length + 2, type: 'input' });
      }
      return tokenData;
    }, []);

    return {
      tokens: tokensData.map((a) => ({
        ...a,
        value: a.type === 'input' ? '' : a.value,
      })),
      answers: tokensData.filter((a) => a.type === 'input'),
    };
  };

  static get sanitize() {
    return {
      div: true,
      br: true,
    };
  }

  backspacePressed(event) {
    event.stopPropagation();
    if (this.input.innerText.trim().length === 0) {
      this.api.blocks.delete();
    }
  }

  render() {
    const container = document.createElement('div');
    container.classList.add(this.CSS.container);

    this.input = document.createElement('div');
    this.input.classList.add(this.CSS.input);
    this.input.setAttribute('placeholder', this.api.i18n.t('placeholder'));
    if (!this.readOnly) {
      this.input.contentEditable = 'true';
    }

    if (this.data.tokens) {
      this.data.tokens = this.data.tokens.map(({ value, type, id }) => ({
        id,
        type,
        value:
          type === 'input'
            ? this.data.answers.find((answer) => answer.id === id).value
            : value,
      }));

      this.input.innerHTML = this.data.tokens
        .map(({ type, value }) => {
          if (type === 'input') {
            return `{{ ${value.join(', ')} }}`;
          }
          return value;
        })
        .join('');
    } else {
      this.input.innerText =
        'Here is an example of a sentence with {{ empty, vacant, blank }} spaces that a {{ learner, student }} will need to fill in. ' +
        'Block also supports {{ }} (no value required)';
    }

    container.appendChild(this.titleWrapper);
    container.appendChild(this.input);

    this.input.addEventListener('keydown', (event) => {
      if (event.code === 'Backspace') {
        this.backspacePressed(event);
      }
    });

    return container;
  }
}
