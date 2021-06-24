export const QUIZ_TYPE = 'quiz';

export const prepareApiData = (data, type) => {
  if (type === QUIZ_TYPE) {
    return {
      ...data,
      answers: data?.answers.map(({ value }) => ({ value })),
    };
  }
  return data;
};

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
