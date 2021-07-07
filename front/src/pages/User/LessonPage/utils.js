export const groupBlocks = (lessons) => {
  const res = [];
  let lastIndex = 0;
  lessons?.forEach((value, i) => {
    if (value?.content?.type === 'next') {
      res.push(lessons.slice(lastIndex, i));
      lastIndex = i + 1;
    } else if (value?.content?.type === 'quiz') {
      res.push(lessons.slice(lastIndex, i));
      res.push(lessons.slice(i, i + 1));
      lastIndex = i + 1;
    }
  });
  if (lastIndex === 0 && lessons?.length !== 0) {
    return [lessons];
  }
  if (lastIndex !== lessons?.length) {
    res.push(lessons.slice(lastIndex));
  }
  return res;
};

export const prepareResultToAnswers = (data) => ({
  ...data,
  lesson: {
    ...data?.lesson,
    blocks: data?.lesson?.blocks.map((x) => ({
      ...x,
      content: {
        ...x.content,
        data: {
          ...x.content.data,
          answers:
            x.type === 'quiz'
              ? x.content.data.answers.map((y, j) => ({
                  ...y,
                  correct: x.data?.response?.[j],
                }))
              : x.content.data.answers,
        },
      },
    })),
  },
});
