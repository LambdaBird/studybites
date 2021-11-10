/* eslint-disable no-underscore-dangle,class-methods-use-this */
/**
 * Build styles
 */
import {
  isBackspaceValid,
  moveCaretToEnd,
} from '@sb-ui/utils/editorjs/toolsHelper';

import PluginBase from '../PluginBase';

import { CenterIcon, LeftIcon, ToolboxIcon } from './resources';

import './index.css';

/**
 * @class Quote
 * @classdesc Quote Tool for Editor.js
 * @property {QuoteData} data - Tool`s input and output data
 * @propert {object} api - Editor.js API instance
 *
 * @typedef {object} QuoteData
 * @description Quote Tool`s input and output data
 * @property {string} text - quote`s text
 * @property {string} caption - quote`s caption
 * @property {'center'|'left'} alignment - quote`s alignment
 *
 * @typedef {object} QuoteConfig
 * @description Quote Tool`s initial configuration
 * @property {string} quotePlaceholder - placeholder to show in quote`s text input
 * @property {string} captionPlaceholder - placeholder to show in quote`s caption input
 * @property {'center'|'left'} defaultAlignment - alignment to use as default
 */
export default class Quote extends PluginBase {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: ToolboxIcon,
      title: 'Quote',
    };
  }

  /**
   * Empty Quote is not empty Block
   *
   * @public
   * @returns {boolean}
   */
  static get contentless() {
    return true;
  }

  /**
   * Allow to press Enter inside the Quote
   *
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Allowed quote alignments
   *
   * @public
   * @returns {{left: string, center: string}}
   */
  static get ALIGNMENTS() {
    return {
      left: 'left',
      center: 'center',
    };
  }

  /**
   * Default quote alignment
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_ALIGNMENT() {
    return Quote.ALIGNMENTS.left;
  }

  /**
   * Allow Quote to be converted to/from other blocks
   */
  static get conversionConfig() {
    return {
      /**
       * To create Quote data from string, simple fill 'text' property
       */
      import: 'text',
      /**
       * To create string from Quote data, concatenate text and caption
       *
       * @param {QuoteData} quoteData
       * @returns {string}
       */
      export(quoteData) {
        return quoteData.caption
          ? `${quoteData.text} — ${quoteData.caption}`
          : quoteData.text;
      },
    };
  }

  /**
   * Tool`s styles
   *
   * @returns {{baseClass: string, wrapper: string, quote: string, input: string, caption: string, settingsButton: string, settingsButtonActive: string}}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-quote',
      text: 'cdx-quote__text',
      input: this.api.styles.input,
      caption: 'cdx-quote__caption',
      settingsWrapper: 'cdx-quote-settings',
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
    };
  }

  /**
   * Tool`s settings properties
   *
   * @returns {*[]}
   */
  get settings() {
    return [
      {
        name: 'left',
        icon: LeftIcon,
      },
      {
        name: 'center',
        icon: CenterIcon,
      },
    ];
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: QuoteData, config: QuoteConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    super({
      title: api.i18n.t('title'),
    });

    const { ALIGNMENTS, DEFAULT_ALIGNMENT } = Quote;

    this.api = api;
    this.readOnly = readOnly;

    this.quotePlaceholder = this.api.i18n.t('input');
    this.captionPlaceholder = this.api.i18n.t('caption');

    this.data = {
      text: data.text || '',
      caption: data.caption || '',
      alignment:
        (Object.values(ALIGNMENTS).includes(data.alignment) &&
          data.alignment) ||
        config.defaultAlignment ||
        DEFAULT_ALIGNMENT,
    };
  }

  /**
   * Create Quote Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make('blockquote', [
      this.CSS.baseClass,
      this.CSS.wrapper,
    ]);
    container.appendChild(this.titleWrapper);
    const quote = this._make('div', [this.CSS.input, this.CSS.text], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.text,
    });
    const caption = this._make('div', [this.CSS.input, this.CSS.caption], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.caption,
    });

    quote.dataset.placeholder = this.quotePlaceholder;

    quote.addEventListener('keydown', this.handleQuoteKeydown.bind(this));
    caption.addEventListener('keydown', this.handleCaptionKeydown.bind(this));
    this.quoteElement = quote;

    container.appendChild(quote);
    container.appendChild(caption);

    return container;
  }

  handleQuoteKeydown(event) {
    if (isBackspaceValid(event, this.quoteElement.innerText)) {
      this.api.blocks.delete();
    }
  }

  handleCaptionKeydown(event) {
    // BACKSPACE KEYCODE
    if (event.keyCode === 8) {
      const sel = window.getSelection();
      const range = sel.getRangeAt(0);
      if (range.startOffset === range.endOffset && range.endOffset === 0) {
        event.preventDefault();
        event.stopPropagation();
        this.quoteElement.focus();
        moveCaretToEnd(this.quoteElement);
      }
    }
  }

  /**
   * Extract Quote data from Quote Tool element
   *
   * @param {HTMLDivElement} quoteElement - element to save
   * @returns {QuoteData}
   */
  save(quoteElement) {
    const text = quoteElement.querySelector(`.${this.CSS.text}`);
    const caption = quoteElement.querySelector(`.${this.CSS.caption}`);

    return Object.assign(this.data, {
      text: text.innerHTML,
      caption: caption.innerHTML,
    });
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: true,
      },
      caption: {
        br: true,
      },
      alignment: {},
    };
  }

  /**
   * Create wrapper for Tool`s settings buttons:
   * 1. Left alignment
   * 2. Center alignment
   *
   * @returns {HTMLDivElement}
   */
  renderSettings() {
    const wrapper = this._make('div', [this.CSS.settingsWrapper], {});
    const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

    this.settings
      .map((tune) => {
        const el = this._make('div', this.CSS.settingsButton, {
          innerHTML: tune.icon,
          title: `${capitalize(tune.name)} alignment`,
        });

        el.classList.toggle(
          this.CSS.settingsButtonActive,
          tune.name === this.data.alignment,
        );

        wrapper.appendChild(el);

        return el;
      })
      .forEach((element, index, elements) => {
        element.addEventListener('click', () => {
          this._toggleTune(this.settings[index].name);

          elements.forEach((el, i) => {
            const { name } = this.settings[i];

            el.classList.toggle(
              this.CSS.settingsButtonActive,
              name === this.data.alignment,
            );
          });
        });
      });

    return wrapper;
  }

  /**
   * Toggle quote`s alignment
   *
   * @param {string} tune - alignment
   * @private
   */
  _toggleTune(tune) {
    this.data.alignment = tune;
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {Array|string} classNames  - list or name of CSS classname(s)
   * @param  {object} attributes        - any attributes
   * @returns {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }
}
