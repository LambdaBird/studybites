import HtmlToReact from 'html-to-react';
import PropTypes from 'prop-types';

import { BlockElementProps } from '../types';

const HtmlToReactParser = HtmlToReact.Parser;

const Paragraph = ({ content }) => {
  const htmlInput = content?.data?.text;
  const htmlToReactParser = new HtmlToReactParser();
  return htmlToReactParser.parse(htmlInput);
};

Paragraph.propTypes = {
  ...BlockElementProps,
  content: {
    ...BlockElementProps.content,
    data: PropTypes.shape({
      text: PropTypes.string,
    }),
  },
};

export default Paragraph;
