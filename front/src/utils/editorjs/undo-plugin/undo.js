import equal from 'fast-deep-equal';

import { BLOCKS_TYPE } from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { moveCaret } from '@sb-ui/utils/editorjs/quiz-plugin/utils';
import { createElementFromHTML } from '@sb-ui/utils/editorjs/utils';

import { isSameElementAsCreated } from './domUtils';
import Observer from './observer';

const BODY_TAG_NAME = 'BODY';
const INPUT_TAG_NAME = 'INPUT';
const CE_TOOLBAR = 'ce-toolbar';
const CE_TOOLBAR_OPENED = 'ce-toolbar--opened';
const INPUT_SELECTORS = '.cdx-input, input, div[contenteditable="true"]';
const DEFAULT_BLOCK = BLOCKS_TYPE.PARAGRAPH;

/**
 * Undo/Redo feature for Editor.js.
 * Based on https://github.com/kommitters/editorjs-undo
 *
 * @typedef {Object} Undo
 * @description Feature's initialization class.
 * @property {Object} editor — Editor.js instance object.
 * @property {Number} maxLength - Max amount of changes recorded by the history stack.
 * @property {Function} onUpdate - Callback called when the user performs an undo or redo action.
 * @property {Boolean} shouldSaveHistory - Defines if the plugin should save the change in the stack
 * @property {Object} initialItem - Initial data object.
 * @property {Object} undoButton - id or element of undo button.
 * @property {Object} redoButton - id or element of redo button.
 */
export default class Undo {
  /**
   * @param options — Plugin custom options.
   */
  constructor({ editor, onUpdate, maxLength, undoButton, redoButton }) {
    const defaultOptions = {
      maxLength: 50,
      onUpdate() {},
    };

    const { configuration } = editor;
    this.editor = editor;
    this.shouldSaveHistory = true;
    this.readOnly = configuration.readOnly;
    this.maxLength = maxLength || defaultOptions.maxLength;
    this.onUpdate = onUpdate || defaultOptions.onUpdate;
    this.undoButton = undoButton;
    this.redoButton = redoButton;
    this.undoStack = [];
    this.redoStack = [];

    const observer = new Observer(
      () => this.registerChange(),
      configuration.holder,
    );
    observer.setMutationObserver();

    this.setEventListeners();
    this.onUpdate();
  }

  /**
   * Notify core that read-only mode is suppoorted
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Truncates the history stack when it excedes the limit of changes.
   *
   * @param {Object} stack  Changes history stack.
   * @param {Number} stack  Limit of changes recorded by the history stack.
   * @param limit
   */
  // eslint-disable-next-line class-methods-use-this
  truncate(stack, limit) {
    while (stack.length > limit) {
      stack.shift();
    }
  }

  /**
   * Initializes the stack when the user provides initial data.
   *
   * @param {Object} initialItem  Initial data provided by the user.
   */
  initialize(initialItem) {
    const initialData =
      'blocks' in initialItem ? initialItem.blocks : initialItem;
    const initialIndex = initialData.length - 1;
    const firstElement = { index: initialIndex, state: initialData };
    this.undoStack = [JSON.parse(JSON.stringify(firstElement))];
    this.toolbar = this.getEditorHolder().querySelector(`.${CE_TOOLBAR}`);
  }

  /**
   * Registers the data returned by API's save method into the history stack.
   */
  registerChange() {
    if (!this.readOnly) {
      if (this.editor && this.editor.save && this.shouldSaveHistory) {
        this.editor.save().then((savedData) => {
          if (this.editorDidUpdate(savedData.blocks))
            this.save(savedData.blocks);
        });
      }
      this.shouldSaveHistory = true;
    }
  }

  /**
   * Checks if the saved data has to be added to the history stack.
   *
   * @param {Object} newData  New data to be saved in the history stack.
   * @returns {Boolean}
   */
  editorDidUpdate(newData) {
    const state = this.undoStack[this.undoStack.length - 1]?.state;
    return !equal(state, newData);
  }

  /**
   * Adds the saved data in the history stack and updates current position.
   */
  save(state) {
    const index = this.editor.blocks.getCurrentBlockIndex();
    const activeElement = document?.activeElement;
    this.undoStack.push({
      index,
      state,
      activeElementHTML:
        activeElement.tagName === BODY_TAG_NAME
          ? null
          : activeElement.outerHTML,
    });
    if (this.redoStack.length === 0 && this.undoStack.length === 2) {
      this.undoStack[0].activeElementHTML = activeElement.outerHTML;
      this.undoStack[0].index = index;
    }

    if (this.undoStack.length >= this.maxLength) {
      this.truncate(this.undoStack, this.maxLength);
    }
    if (this.redoStack.length >= this.maxLength) {
      this.truncate(this.redoStack, this.maxLength);
    }
    this.onUpdate();
  }

  /**
   * Decreases the current position and renders the data in the editor.
   */
  undo() {
    if (this.undoStack.length <= 1) {
      return;
    }
    const topElement = this.undoStack.pop();
    if (topElement) {
      this.redoStack.push(topElement);
    }
    this.updateBlocks();
  }

  /**
   * Increases the current position and renders the data in the editor.
   */
  redo() {
    const topElement = this.redoStack.pop();
    if (topElement) {
      this.undoStack.push(topElement);
    }
    this.updateBlocks();
  }

  getHolderWithCorrectIndex(index) {
    const countBlocks = this.editor.blocks.getBlocksCount();
    const correctIndex = index + 1 > countBlocks ? countBlocks - 1 : index;
    const holderByIndex =
      this.editor.blocks?.getBlockByIndex(correctIndex)?.holder;
    const holder =
      holderByIndex || this.editor.blocks.getBlockByIndex(0)?.holder;
    return { holder, correctIndex };
  }

  getRealElement({ holder, activeElementHTML }) {
    const createdElement = createElementFromHTML(activeElementHTML);
    const tagName = createdElement.tagName.toLowerCase();
    const createdElementAttributes = [...createdElement.attributes];
    const allElements = holder.querySelectorAll(tagName);
    return (
      [...allElements].find((element) =>
        isSameElementAsCreated({ element, createdElementAttributes }),
      ) ||
      holder.querySelector(INPUT_SELECTORS) ||
      this.addAndTakeLastBlockInput()
    );
  }

  afterRenderNewBlocks({ index, activeElementHTML }) {
    if (index < 0) {
      return;
    }
    const { holder, correctIndex } = this.getHolderWithCorrectIndex(index);
    if (activeElementHTML) {
      const realElement = this.getRealElement({ holder, activeElementHTML });
      if (realElement?.isContentEditable) {
        moveCaret(realElement);
      } else if (realElement?.tagName === INPUT_TAG_NAME) {
        realElement?.focus();
      }
      realElement?.scrollIntoViewIfNeeded?.(true);
    } else {
      this.editor.caret.setToBlock(correctIndex, 'start');
      holder?.scrollIntoViewIfNeeded?.(true);
    }
  }

  /**
   * Renders data in the editor by index with state
   */
  async updateBlocks() {
    const { index, state, activeElementHTML } =
      this.undoStack.slice(-1)?.[0] || {};

    if (!state) {
      return;
    }
    if (state.length === 0) {
      this.editor.clear();
      return;
    }

    this.onUpdate();
    const savedData = await this.editor.save?.();
    if (equal(savedData?.blocks, state)) {
      return;
    }
    this.toolbar?.classList?.remove?.(CE_TOOLBAR_OPENED);
    const newState = state?.map((block) => ({
      ...block,
      data: block.data === null ? {} : block.data,
    }));
    this.editor.blocks.render({ blocks: newState }).then(() => {
      this.afterRenderNewBlocks({ index, activeElementHTML });
    });
  }

  addAndTakeLastBlockInput() {
    this.editor.blocks.insert(DEFAULT_BLOCK);
    const lastBlockIndex = this.editor.blocks.getBlocksCount() - 1;
    const bl = this.editor.blocks.getBlockByIndex(lastBlockIndex);
    return bl.holder.querySelector(INPUT_SELECTORS);
  }

  getEditorHolder() {
    const { holder } = this.editor.configuration;
    return typeof holder === 'string'
      ? document.getElementById(holder)
      : holder;
  }

  /**
   * Sets events listeners to allow keyboard actions support.
   */
  setEventListeners() {
    const holderElement = this.getEditorHolder();
    const undoButtonElement =
      typeof this.undoButton === 'string'
        ? document.getElementById(this.undoButton)
        : this.undoButton;

    const redoButtonElement =
      typeof this.redoButton === 'string'
        ? document.getElementById(this.redoButton)
        : this.redoButton;

    const buttonKey = /(Mac)/i.test(navigator.platform) ? 'metaKey' : 'ctrlKey';

    const handleUndo = (e) => {
      e.preventDefault();
      this.undo();
    };

    const handleRedo = (e) => {
      e.preventDefault();
      this.redo();
    };

    const handleAction = (e) => {
      if (e.code === 'KeyZ' && e[buttonKey]) {
        if (e.shiftKey) {
          handleRedo(e);
        } else {
          handleUndo(e);
        }
      }
    };

    const handleDestroy = () => {
      holderElement.removeEventListener('keydown', handleAction);
      undoButtonElement.removeEventListener('click', handleUndo);
      redoButtonElement.removeEventListener('click', handleRedo);
    };

    holderElement.addEventListener('keydown', handleAction);

    undoButtonElement.addEventListener('click', handleUndo);
    redoButtonElement.addEventListener('click', handleRedo);

    holderElement.addEventListener('destroy', handleDestroy);
  }
}
