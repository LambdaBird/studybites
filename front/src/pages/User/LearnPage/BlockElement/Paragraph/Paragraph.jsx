import { htmlToReact } from '@sb-ui/pages/User/LearnPage/utils';

import { ParagraphContentType } from '../types';

const Paragraph = ({ content }) => {
  const htmlInput = content?.data?.text;
  return <p>{htmlToReact(htmlInput)}</p>;
};

Paragraph.propTypes = {
  content: ParagraphContentType,
};

export default Paragraph;
