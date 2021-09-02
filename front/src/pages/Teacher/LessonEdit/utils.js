import Table from 'editorjs-table';
import hash from 'object-hash';
import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import HeaderTool from '@editorjs/header';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import Warning from '@editorjs/warning';

import { BLOCKS_TYPE } from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import ClosedQuestion from '@sb-ui/utils/editorjs/closed-question-plugin';
import Embed from '@sb-ui/utils/editorjs/embed-plugin';
import FillTheGap from '@sb-ui/utils/editorjs/fill-the-gap/plugin';
import Image from '@sb-ui/utils/editorjs/image-plugin';
import Match from '@sb-ui/utils/editorjs/match-plugin';
import Next from '@sb-ui/utils/editorjs/next-plugin';
import Quiz from '@sb-ui/utils/editorjs/quiz-plugin';
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
      default:
        return content;
    }
  });

export const prepareBlocksDataForApi = (data, type) => {
  if (!data) {
    return null;
  }
  const { answers, explanation, ...sendData } = data || {};
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
    case BLOCKS_TYPE.MATCH:
      return {
        ...data,
        values: prepareMatchValues(data.values),
      };

    default:
      return data;
  }
};

const SKIP_BLOCKS = [
  BLOCKS_TYPE.EMBED,
  BLOCKS_TYPE.IMAGE,
  BLOCKS_TYPE.CLOSED_QUESTION,
  BLOCKS_TYPE.FILL_THE_GAP,
  BLOCKS_TYPE.MATCH,
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

export const getConfig = (t) => ({
  holder: 'editorjs',
  tools: {
    next: Next,
    image: {
      class: Image,
      inlineToolbar: true,
    },
    embed: {
      class: Embed,
      inlineToolbar: true,
    },
    quiz: {
      class: Quiz,
      inlineToolbar: true,
    },
    closedQuestion: {
      class: ClosedQuestion,
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
    match: {
      class: Match,
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
    list: {
      class: List,
      inlineToolbar: true,
    },
    quote: {
      class: Quote,
      inlineToolbar: true,
    },
    delimiter: Delimiter,
    marker: Marker,

    table: {
      class: Table,
      inlineToolbar: true,
    },
    code: CodeTool,
    fillTheGap: {
      class: FillTheGap,
      inlineToolbar: true,
    },
  },
  plugins: [],
});
