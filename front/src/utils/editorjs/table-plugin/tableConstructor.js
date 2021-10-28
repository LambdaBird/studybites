/* eslint-disable no-underscore-dangle */
import { create } from './documentUtils';
import { Table } from './table';

import './tableConstructor.css';

const CSS = {
  editor: 'tc-editor',
  toolBarHor: 'tc-toolbar--hor',
  toolBarVer: 'tc-toolbar--ver',
  inputField: 'tc-table__inp',
};

/**
 * Entry point. Controls table and give API to user
 */
export class TableConstructor {
  /**
   * Creates
   * @param {TableData} data - previously saved data for insert in table
   * @param {object} config - configuration of table
   * @param {object} api - Editor.js API
   * @param {boolean} readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    /** creating table */
    this.readOnly = readOnly;
    this._table = new Table({ api, readOnly });
    const size = this._resizeTable(data, config);

    this._fillTable(data, size);

    /** creating container around table */
    this._container = create(
      'div',
      [CSS.editor, api.styles && api.styles.block],
      null,
      [this._table.htmlElement],
    );
  }

  /**
   * returns html element of TableConstructor;
   * @return {HTMLElement}
   */
  get htmlElement() {
    return this._container;
  }

  /**
   * Returns instance of Table
   * @returns {Table}
   */
  get table() {
    return this._table;
  }

  /**
   * @private
   *
   *  Fill table data passed to the constructor
   * @param {TableData} data - data for insert in table
   * @param {{rows: number, cols: number}} size - contains number of rows and cols
   */
  _fillTable(data, size) {
    if (data.content !== undefined) {
      for (let i = 0; i < size.rows && i < data.content.length; i += 1) {
        for (let j = 0; j < size.cols && j < data.content[i].length; j += 1) {
          // get current cell and her editable part
          const input = this._table.body.rows[i].cells[j].querySelector(
            `.${CSS.inputField}`,
          );

          input.innerHTML = data.content[i][j];
        }
      }
    }
  }

  /**
   * @private
   *
   * resize to match config or transmitted data
   * @param {TableData} data - data for inserting to the table
   * @param {object} config - configuration of table
   * @param {number|string} config.rows - number of rows in configuration
   * @param {number|string} config.cols - number of cols in configuration
   * @return {{rows: number, cols: number}} - number of cols and rows
   */
  _resizeTable(data, config) {
    const isValidArray = Array.isArray(data.content);
    const isNotEmptyArray = isValidArray ? data.content.length : false;
    const contentRows = isValidArray ? data.content.length : undefined;
    const contentCols = isNotEmptyArray ? data.content[0].length : undefined;
    const parsedRows = Number.parseInt(config.rows, 10);
    const parsedCols = Number.parseInt(config.cols, 10);
    // value of config have to be positive number
    const configRows =
      !Number.isNaN(parsedRows) && parsedRows > 0 ? parsedRows : undefined;
    const configCols =
      !Number.isNaN(parsedCols) && parsedCols > 0 ? parsedCols : undefined;
    const defaultRows = 1;
    const defaultCols = 1;
    const rows = contentRows || configRows || defaultRows;
    const cols = contentCols || configCols || defaultCols;

    for (let i = 0; i < rows; i += 1) {
      this._table.insertRow();
    }
    for (let i = 0; i < cols; i += 1) {
      this._table.insertColumn();
    }

    return {
      rows,
      cols,
    };
  }
}
