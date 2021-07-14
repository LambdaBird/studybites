import PropTypes from 'prop-types';

export const BLOCKS_TYPE = {
  PARAGRAPH: 'paragraph',
  QUIZ: 'quiz',
  EMBED: 'embed',
  IMAGE: 'image',
  LIST: 'list',
  HEADER: 'header',
  QUOTE: 'quote',
  DELIMITER: 'delimiter',
  TABLE: 'table',
};

export const BlockContentType = PropTypes.shape({
  type: PropTypes.oneOf(Object.values(BLOCKS_TYPE)),
});

export const BlockIdType = PropTypes.string.isRequired;

export const ParagraphContentType = PropTypes.shape({
  data: PropTypes.shape({
    text: PropTypes.string,
  }),
});

export const QuizBlockDataType = PropTypes.shape({
  answers: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
    }),
  ).isRequired,
  question: PropTypes.string.isRequired,
});

export const QuizBlockAnswerType = PropTypes.shape({
  results: PropTypes.arrayOf(PropTypes.bool).isRequired,
});
export const EmbedContentType = PropTypes.shape({
  data: PropTypes.shape({
    caption: PropTypes.string,
    embed: PropTypes.string,
    height: PropTypes.string,
  }),
});

export const ImageContentType = PropTypes.shape({
  data: PropTypes.shape({
    caption: PropTypes.string,
    url: PropTypes.string,
  }),
});

export const ListContentType = PropTypes.shape({
  data: PropTypes.shape({
    style: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.string),
  }),
});

export const QuoteContentType = PropTypes.shape({
  data: PropTypes.shape({
    text: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    alignment: PropTypes.oneOf(['left', 'center']),
  }),
});

export const TableContentType = PropTypes.shape({
  data: PropTypes.shape({
    content: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  }),
});

export const HeaderContentType = PropTypes.shape({
  data: PropTypes.shape({
    text: PropTypes.string,
    level: PropTypes.number,
  }),
});

export const BlockElementProps = PropTypes.shape({
  element: PropTypes.shape({
    content: BlockContentType.isRequired,
    blockId: BlockIdType,
    answer: QuizBlockAnswerType,
  }),
});
