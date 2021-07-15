import HtmlToReact from 'html-to-react';

import { ParagraphContentType } from '../types';

const HtmlToReactParser = HtmlToReact.Parser;

const Paragraph = ({ content }) => {
  const htmlInput = content?.data?.text;
  const htmlToReactParser = new HtmlToReactParser();
  return htmlToReactParser.parse(htmlInput);
};

Paragraph.propTypes = {
  content: ParagraphContentType,
};

export default Paragraph;
