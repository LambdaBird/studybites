import Observer from './observer';

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
      maxLength: 30,
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

    const observer = new Observer(
      () => this.registerChange(),
      configuration.holder,
    );
    observer.setMutationObserver();

    this.setEventListeners();
    this.initialItem = null;
    this.clear();
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
    this.stack[0] = firstElement;
    this.initialItem = firstElement;
  }

  /**
   * Clears the history stack.
   */
  clear() {
    this.stack = this.initialItem
      ? [this.initialItem]
      : [{ index: 0, state: [] }];
    this.position = 0;
    this.onUpdate();
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
    const { state } = this.stack[this.position];
    if (newData.length !== state.length) return true;

    return JSON.stringify(state) !== JSON.stringify(newData);
  }

  /**
   * Adds the saved data in the history stack and updates current position.
   */
  save(state) {
    if (this.position >= this.maxLength) {
      this.truncate(this.stack, this.maxLength);
    }
    this.position = Math.min(this.position, this.stack.length - 1);

    this.stack = this.stack.slice(0, this.position + 1);

    const index = this.editor.blocks.getCurrentBlockIndex();
    this.stack.push({ index, state });
    this.position += 1;
    this.onUpdate();
  }

  /**
   * Decreases the current position and renders the data in the editor.
   */
  undo() {
    if (this.canUndo()) {
      this.shouldSaveHistory = false;
      const { index, state } = this.stack[(this.position -= 1)];
      this.onUpdate();
      if (state.length === 0) {
        this.editor.clear();
      } else {
        this.editor.blocks.render({ blocks: state }).then(() => {
          this.editor.caret.setToBlock(index, 'end');
          this.editor.caret.focus(true);
        });
      }
    }
  }

  /**
   * Increases the current position and renders the data in the editor.
   */
  redo() {
    if (this.canRedo()) {
      this.shouldSaveHistory = false;
      const { index, state } = this.stack[(this.position += 1)];
      this.onUpdate();
      if (state.length === 0) {
        this.editor.clear();
      } else {
        this.editor.blocks.render({ blocks: state }).then(() => {
          this.editor.caret.setToBlock(index, 'end');
          this.editor.caret.focus(true);
        });
      }
    }
  }

  /**
   * Checks if the history stack can perform an undo action.
   *
   * @returns {Boolean}
   */
  canUndo() {
    return !this.readOnly && this.position > 0;
  }

  /**
   * Checks if the history stack can perform a redo action.
   *
   * @returns {Boolean}
   */
  canRedo() {
    return !this.readOnly && this.position < this.count();
  }

  /**
   * Returns the number of changes recorded in the history stack.
   *
   * @returns {Number}
   */
  count() {
    return this.stack.length - 1; // -1 because of initial item
  }

  /**
   * Sets events listeners to allow keyboard actions support.
   */
  setEventListeners() {
    const { holder } = this.editor.configuration;
    const holderElement =
      typeof holder === 'string' ? document.getElementById(holder) : holder;

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
      if (e.code === 'KeyZ') {
        if (e[buttonKey] && !e.shiftKey) {
          handleUndo(e);
        } else if (e[buttonKey] && e.shiftKey) {
          handleRedo(e);
        }

        this.editor.caret.focus();
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
