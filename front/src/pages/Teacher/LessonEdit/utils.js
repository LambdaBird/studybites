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
import Bricks from '@sb-ui/utils/editorjs/bricks-plugin';
import ClosedQuestion from '@sb-ui/utils/editorjs/closed-question-plugin';
import Embed from '@sb-ui/utils/editorjs/embed-plugin';
import Image from '@sb-ui/utils/editorjs/image-plugin';
import Next from '@sb-ui/utils/editorjs/next-plugin';
import Quiz from '@sb-ui/utils/editorjs/quiz-plugin';
import { shuffleArray } from '@sb-ui/utils/utils';

const MAX_BODY_LENGTH = 4_000_000;

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
      case BLOCKS_TYPE.BRICKS:
        return {
          ...content,
          data: {
            ...content?.data,
            answers: answer?.results,
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
      return {
        ...sendData,
      };
    case BLOCKS_TYPE.BRICKS:
      return {
        ...sendData,
        words: shuffleArray(words),
      };
    default:
      return data;
  }
};

const SKIP_BLOCKS = [
  BLOCKS_TYPE.EMBED,
  BLOCKS_TYPE.IMAGE,
  BLOCKS_TYPE.CLOSED_QUESTION,
];

export const prepareBlocksForApi = (blocks) =>
  blocks
    .map((block) => {
      const { id, type, data } = block;
      const answer = {};

      switch (type) {
        case BLOCKS_TYPE.QUIZ:
          answer.results = block?.data?.answers?.map((x) => x.correct);
          break;
        case BLOCKS_TYPE.CLOSED_QUESTION:
          answer.explanation = block?.data?.explanation;
          answer.results = block?.data?.answers;
          break;
        case BLOCKS_TYPE.BRICKS:
          answer.results = block?.data?.answers;
          break;
        default:
          break;
      }

      return {
        type,
        revision: hash(block),
        content: {
          id,
          type,
          data: prepareBlocksDataForApi(data, type),
        },
        answer,
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
    bricks: {
      class: Bricks,
      inlineToolbar: true,
    },
  },
  plugins: [],
});
