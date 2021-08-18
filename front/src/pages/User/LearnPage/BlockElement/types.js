import PropTypes from 'prop-types';

export const BLOCKS_TYPE = {
  PARAGRAPH: 'paragraph',
  QUIZ: 'quiz',
  CODE: 'code',
  EMBED: 'embed',
  IMAGE: 'image',
  MATCH: 'match',
  LIST: 'list',
  HEADER: 'header',
  QUOTE: 'quote',
  DELIMITER: 'delimiter',
  TABLE: 'table',
  FINISH: 'finish',
  FINISHED: 'finished',
  WARNING: 'warning',
  NEXT: 'next',
  START: 'start',
  CLOSED_QUESTION: 'closedQuestion',
};

export const BlockContentType = PropTypes.shape({
  type: PropTypes.oneOf(Object.values(BLOCKS_TYPE)),
});

export const BlockIdType = PropTypes.string.isRequired;
export const RevisionType = PropTypes.string.isRequired;
export const QuestionType = PropTypes.string.isRequired;

export const ParagraphContentType = PropTypes.shape({
  data: PropTypes.shape({
    text: PropTypes.string,
  }),
});

export const ClosedQuestionBlockDataType = PropTypes.shape({
  answer: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
});

export const ClosedQuestionBlockAnswerType = PropTypes.shape({
  results: PropTypes.arrayOf(PropTypes.string),
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
  results: PropTypes.arrayOf(PropTypes.bool),
});

export const ClosedQuestionResponseDataType = PropTypes.shape({
  response: PropTypes.string,
});

export const BlockResponseDataType = PropTypes.shape({
  response: PropTypes.arrayOf(PropTypes.bool),
});


export const MatchBlockDataType = PropTypes.shape({
  answers: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
  ),
});

export const MatchResponseDataType = PropTypes.shape({
  response: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
  ),
});

export const MatchBlockAnswerType = PropTypes.shape({
  results: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
  ),
});

export const EmbedContentType = PropTypes.shape({
  data: PropTypes.shape({
    caption: PropTypes.string,
    embed: PropTypes.string,
    height: PropTypes.string,
  }),
});

export const WarningContentType = PropTypes.shape({
  data: PropTypes.shape({
    message: PropTypes.string,
    title: PropTypes.string,
  }),
});

export const CodeContentType = PropTypes.shape({
  code: PropTypes.string,
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

export const NextPropType = {
  response: PropTypes.shape({
    isSolved: PropTypes.bool,
  }),
};
