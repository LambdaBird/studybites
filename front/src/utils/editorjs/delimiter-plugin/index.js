/* eslint-disable no-underscore-dangle */
/**
 * Build styles
 */
import PluginBase from '../PluginBase';

import { ToolboxIcon } from './resources';

import './index.css';

/**
 * Delimiter Block for the Editor.js.
 *
 * @author CodeX (team@ifmo.su)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 * @version 2.0.0
 */

/**
 * @typedef {Object} DelimiterData
 * @description Tool's input and output data format
 */
export default class Delimiter extends PluginBase {
  /**
   * Notify core that read-only mode is supported
   * @return {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Allow Tool to have no content
   * @return {boolean}
   */
  static get contentless() {
    return true;
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: DelimiterData, config: object, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   */
  constructor({ data, api }) {
    super({
      title: api.i18n.t('title'),
    });

    this.api = api;

    this._CSS = {
      wrapper: 'ce-delimiter',
    };

    this._data = {};
    this._element = this.drawView();

    this.data = data;
  }

  /**
   * Create Tool's view
   * @return {HTMLElement}
   * @private
   */
  drawView() {
    const div = document.createElement('DIV');

    div.classList.add(this._CSS.wrapper);

    return div;
  }

  /**
   * Return Tool's view
   * @returns {HTMLDivElement}
   * @public
   */
  render() {
    const container = document.createElement('div');
    container.appendChild(this.titleWrapper);
    container.appendChild(this._element);
    return container;
  }

  /**
   * Extract Tool's data from the view
   * @returns {DelimiterData} - saved data
   * @public
   */
  // eslint-disable-next-line class-methods-use-this
  save() {
    return {};
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: ToolboxIcon,
      title: 'Delimiter',
    };
  }
}
