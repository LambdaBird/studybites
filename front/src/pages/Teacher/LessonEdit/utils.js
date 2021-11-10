import hash from 'object-hash';
import Marker from '@editorjs/marker';

import { BLOCKS_TYPE } from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import Attach from '@sb-ui/utils/editorjs/attach-plugin';
import Bricks from '@sb-ui/utils/editorjs/bricks-plugin';
import ClosedQuestion from '@sb-ui/utils/editorjs/closed-question-plugin';
import CodeTool from '@sb-ui/utils/editorjs/code-plugin';
import Delimiter from '@sb-ui/utils/editorjs/delimiter-plugin';
import Embed from '@sb-ui/utils/editorjs/embed-plugin';
import FillTheGap from '@sb-ui/utils/editorjs/fill-the-gap/plugin';
import GradedQuestion from '@sb-ui/utils/editorjs/graded-question-plugin';
import HeaderTool from '@sb-ui/utils/editorjs/header-plugin';
import Image from '@sb-ui/utils/editorjs/image-plugin';
import List from '@sb-ui/utils/editorjs/list-plugin';
import Match from '@sb-ui/utils/editorjs/match-plugin';
import Next from '@sb-ui/utils/editorjs/next-plugin';
import Paragraph from '@sb-ui/utils/editorjs/paragraph-plugin';
import Quiz from '@sb-ui/utils/editorjs/quiz-plugin';
import Quote from '@sb-ui/utils/editorjs/quote-plugin';
import Table from '@sb-ui/utils/editorjs/table-plugin';
import Warning from '@sb-ui/utils/editorjs/warning-plugin';
import { shuffleArray } from '@sb-ui/utils/utils';

const MAX_BODY_LENGTH = 4_000_000;

const prepareMatchValues = (values) => {
  const rightValues = values.map((value) => value.right);
  const shuffledRightValues = shuffleArray(rightValues);
  return values.map((value, index) => ({
    ...value,
    right: shuffledRightValues[index],
  }));
};

export const prepareEditorData = (blocks) =>
  blocks?.map(({ content, answer, type }) => {
    switch (type) {
      case BLOCKS_TYPE.QUIZ:
        return {
          ...content,
          data: {
            ...content?.data,
            answers: content?.data?.answers?.map(({ value }, i) => ({
              value,
              correct: answer?.results[i],
            })),
          },
        };
      case BLOCKS_TYPE.CLOSED_QUESTION:
        return {
          ...content,
          data: {
            ...content?.data,
            answers: answer?.results,
            explanation: answer?.explanation,
          },
        };
      case BLOCKS_TYPE.FILL_THE_GAP:
        return {
          ...content,
          data: {
            ...content?.data,
            answers: answer?.results,
          },
        };
      case BLOCKS_TYPE.MATCH:
        return {
          ...content,
          data: {
            values: answer?.results,
          },
        };
      case BLOCKS_TYPE.BRICKS:
        return {
          ...content,
          data: {
            ...content?.data,
            answers: answer?.words,
          },
        };
      default:
        return content;
    }
  });

export const prepareBlocksDataForApi = (data, type) => {
  if (!data) {
    return null;
  }
  const { answers, words, explanation, ...sendData } = data || {};
  switch (type) {
    case BLOCKS_TYPE.QUIZ:
      return {
        ...sendData,
        answers: answers.map(({ value }) => ({ value })),
      };
    case BLOCKS_TYPE.CLOSED_QUESTION:
    case BLOCKS_TYPE.FILL_THE_GAP:
      return {
        ...sendData,
      };
    case BLOCKS_TYPE.BRICKS:
      return {
        ...sendData,
        words: shuffleArray(words),
      };
    case BLOCKS_TYPE.MATCH:
      return {
        ...data,
        values: prepareMatchValues(data.values),
      };
    case BLOCKS_TYPE.ATTACH:
      return data.location ? data : null;
    default:
      return data;
  }
};

const SKIP_BLOCKS = [
  BLOCKS_TYPE.QUIZ,
  BLOCKS_TYPE.EMBED,
  BLOCKS_TYPE.IMAGE,
  BLOCKS_TYPE.CLOSED_QUESTION,
  BLOCKS_TYPE.FILL_THE_GAP,
  BLOCKS_TYPE.MATCH,
  BLOCKS_TYPE.BRICKS,
  BLOCKS_TYPE.ATTACH,
  BLOCKS_TYPE.GRADED_QUESTION,
];

export const makeAnswerForBlock = (block) => {
  switch (block.type) {
    case BLOCKS_TYPE.QUIZ:
      return {
        results: block?.data?.answers?.map((x) => x.correct),
      };
    case BLOCKS_TYPE.CLOSED_QUESTION:
      return {
        explanation: block?.data?.explanation,
        results: block?.data?.answers,
      };
    case BLOCKS_TYPE.MATCH:
      return {
        results: block?.data?.values,
      };
    case BLOCKS_TYPE.FILL_THE_GAP:
      return {
        results: block?.data?.answers,
      };
    case BLOCKS_TYPE.BRICKS:
      return {
        words: block?.data?.answers,
      };
    default:
      return {};
  }
};

export const prepareBlocksForApi = (blocks) =>
  blocks
    .map((block) => {
      const { id, type, data } = block;
      return {
        type,
        revision: hash(block),
        content: {
          id,
          type,
          data: prepareBlocksDataForApi(data, type),
        },
        answer: makeAnswerForBlock(block),
      };
    })
    .filter((block) =>
      SKIP_BLOCKS.every(
        (b) => !(block.type === b && block.content.data === null),
      ),
    )
    .filter((block) => JSON.stringify(block).length < MAX_BODY_LENGTH);

export const getBaseBlocks = (t) => ({
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  header: {
    class: HeaderTool,
    config: {
      placeholder: t('editor_js.header.placeholder'),
      levels: [1, 2, 3, 4, 5],
      defaultLevel: 2,
    },
    inlineToolbar: true,
  },
  image: {
    class: Image,
    inlineToolbar: true,
  },
  embed: {
    class: Embed,
    inlineToolbar: true,
  },
  attach: {
    class: Attach,
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  warning: {
    class: Warning,
    inlineToolbar: true,
    config: {
      titlePlaceholder: t('editor_js.tools.warning_title'),
      messagePlaceholder: t('editor_js.tools.warning_message'),
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  code: CodeTool,
  table: {
    class: Table,
    inlineToolbar: true,
  },
  delimiter: Delimiter,
});

export const getInteractiveBlocks = () => ({
  next: Next,
  quiz: {
    class: Quiz,
    inlineToolbar: true,
  },
  closedQuestion: {
    class: ClosedQuestion,
    inlineToolbar: true,
  },
  fillTheGap: {
    class: FillTheGap,
    inlineToolbar: true,
  },
  match: {
    class: Match,
    inlineToolbar: true,
  },
  bricks: {
    class: Bricks,
    inlineToolbar: true,
  },
  gradedQuestion: {
    class: GradedQuestion,
    inlineToolbar: true,
  },
});

export const getInlineTool = () => ({
  marker: Marker,
});

export const getConfig = (t) => ({
  holder: 'editorjs',
  tools: {
    ...getBaseBlocks(t),
    ...getInteractiveBlocks(t),
    ...getInlineTool(t),
  },
  plugins: [],
});
