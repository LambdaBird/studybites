import PropTypes from 'prop-types';

export const BLOCKS_TYPE = {
  ATTACH: 'attach',
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
  GRADED_QUESTION: 'gradedQuestion',
  FILL_THE_GAP: 'fillTheGap',
  BRICKS: 'bricks',
};

export const BlockContentType = PropTypes.shape({
  type: PropTypes.oneOf(Object.values(BLOCKS_TYPE)),
});

export const BlockIdType = PropTypes.string.isRequired;
export const RevisionType = PropTypes.string.isRequired;
export const QuestionType = PropTypes.string.isRequired;
export const TextType = PropTypes.string.isRequired;
export const SolvedType = PropTypes.bool;

export const ParagraphContentType = PropTypes.shape({
  data: PropTypes.shape({
    text: PropTypes.string,
  }),
});

export const FillTheGapBlockReplyType = PropTypes.shape({
  response: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      id: PropTypes.number,
      type: PropTypes.oneOf(['text', 'input']),
    }),
  ),
});

export const FillTheGapBlockAnswerType = PropTypes.shape({
  results: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.arrayOf(PropTypes.string),
      id: PropTypes.number,
      type: PropTypes.oneOf(['text', 'input']),
    }),
  ),
});

export const ClosedQuestionBlockDataType = PropTypes.shape({
  question: PropTypes.string.isRequired,
});

export const ClosedQuestionBlockAnswerType = PropTypes.shape({
  results: PropTypes.arrayOf(PropTypes.string),
});

export const ClosedQuestionBlockReplyType = PropTypes.shape({
  value: PropTypes.string.isRequired,
});

export const BricksBlockAnswerType = PropTypes.shape({
  words: PropTypes.arrayOf(PropTypes.string),
});

export const BricksBlockReplyType = PropTypes.shape({
  words: PropTypes.arrayOf(PropTypes.string),
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

export const QuizBlockReplyType = PropTypes.shape({
  results: PropTypes.arrayOf(PropTypes.bool),
});

export const GradedQuestionBlockReplyType = PropTypes.shape({
  value: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.shape({})),
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

export const AttachContentType = PropTypes.shape({
  location: PropTypes.string,
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
