import ReactDOM from 'react-dom';

import { sanitizeBlocks } from '@sb-ui/utils/editorjs/utils';

import GradedQuestionComponent from './GradedQuestion/GradedQuestion';
import { ToolboxIcon } from './resources';

export default class GradedQuestion {
  constructor({ data, api, readOnly, block }) {
    this.block = block;
    this.data = data;
    this.api = api;
    this.readOnly = readOnly;

    this.requireAttachment = false;
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get toolbox() {
    return {
      icon: ToolboxIcon,
      title: 'Graded Question',
    };
  }

  save = () => ({
    question: this.questionInput?.innerHTML,
    requireAttachment: this.requireAttachment,
  });

  static get sanitize() {
    return {
      div: true,
      br: true,
      ...sanitizeBlocks,
    };
  }

  render() {
    const container = document.createElement('div');
    ReactDOM.render(<GradedQuestionComponent tool={this} />, container);
    return container;
  }
}
