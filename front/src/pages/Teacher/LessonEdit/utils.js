import Table from 'editorjs-table';
import hash from 'object-hash';
import Delimiter from '@editorjs/delimiter';
import HeaderTool from '@editorjs/header';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import SimpleImage from '@editorjs/simple-image';

import Embed from '@sb-ui/utils/editorjs/embed-plugin';
import Next from '@sb-ui/utils/editorjs/next-plugin';
import Quiz from '@sb-ui/utils/editorjs/quiz-plugin';

export const QUIZ_TYPE = 'quiz';

export const prepareEditorData = (blocks) =>
  blocks.map(({ content, answer, type }) =>
    type === QUIZ_TYPE
      ? {
          ...content,
          data: {
            ...content?.data,
            answers: content?.data?.answers?.map(({ value }, i) => ({
              value,
              correct: answer?.results[i],
            })),
          },
        }
      : content,
  );

export const prepareBlocksDataForApi = (data, type) => {
  if (type === QUIZ_TYPE) {
    return {
      ...data,
      answers: data?.answers.map(({ value }) => ({ value })),
    };
  }
  return data;
};

export const prepareBlocksForApi = (blocks) =>
  blocks.map((block) => {
    const { id, type, data } = block;
    return {
      type,
      revision: hash(block),
      content: {
        id,
        type,
        data: prepareBlocksDataForApi(data, type),
      },
      answer: {
        results:
          type === QUIZ_TYPE
            ? block?.data?.answers?.map((x) => x.correct)
            : undefined,
      },
    };
  });

export const getConfig = (t) => ({
  holder: 'editorjs',
  tools: {
    image: SimpleImage,
    next: Next,
    quiz: Quiz,
    embed: Embed,
    header: {
      class: HeaderTool,
      config: {
        placeholder: t('editor_js.header.placeholder'),
        levels: [1, 2, 3, 4, 5],
        defaultLevel: 3,
      },
    },
    list: {
      class: List,
      inlineToolbar: true,
    },
    quote: Quote,
    delimiter: Delimiter,
    marker: Marker,
    table: Table,
  },
  i18n: {
    messages: {
      ui: {
        toolbar: {
          toolbox: {
            Add: t('editor_js.toolbar.toolbox_add'),
          },
        },
      },
      toolNames: {
        Text: t('editor_js.tool_names.text'),
        Next: t('editor_js.tool_names.next'),
      },
    },
  },
  plugins: [],
});
