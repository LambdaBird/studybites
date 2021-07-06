import HtmlToReact from 'html-to-react';
import { BlockElementProps } from '../utils';

const HtmlToReactParser = HtmlToReact.Parser;

const Paragraph = ({ content }) => {
  const htmlInput = content?.data?.text;
  const htmlToReactParser = new HtmlToReactParser();
  return htmlToReactParser.parse(htmlInput);
};

Paragraph.propTypes = BlockElementProps;

export default Paragraph;
