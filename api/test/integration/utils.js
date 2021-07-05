import { v4 } from 'uuid';

export const authorizeUser = async ({
  credentials,
  app,
  setToken = () => {},
}) => {
  await app.ready();

  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/user/signin',
    payload: credentials,
  });

  const data = JSON.parse(response.payload);

  setToken(data.accessToken);

  return data.accessToken;
};

export const createLesson = async ({
  app,
  credentials,
  body,
}) => {
  const token = await authorizeUser({
    app,
    credentials,
  });

  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/lesson/maintain/',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  const payload = JSON.parse(response.payload);

  return payload;
};

export const prepareLessonFromSeed = (lessonSeed, nameModifier = '') => ({
  lesson: {
    name: `${lessonSeed.name}${nameModifier}`,
    status: 'Public',
  },
  blocks: lessonSeed._blocks._current.map(structureItem => {
    const lastRevision = structureItem._revisions[0];

    return {
      content: lastRevision.content,
      type: lastRevision.type,
      answer: lastRevision.answer,
      revision: v4(),
    };
  }),
});
