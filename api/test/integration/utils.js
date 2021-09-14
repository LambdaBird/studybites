import { v4 } from 'uuid';
import { french, russian } from '../../seeds/testData/lessons';
import { courseToTest, secondCourseToTest } from '../../seeds/testData/courses';

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

export const createLesson = async ({ app, credentials, body }) => {
  const token = await authorizeUser({
    app,
    credentials,
  });

  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/lessons-management/lessons',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  const payload = JSON.parse(response.payload);

  return payload;
};

export const createCourse = async ({ app, credentials, body }) => {
  const token = await authorizeUser({
    app,
    credentials,
  });

  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/courses-management/courses',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  const payload = JSON.parse(response.payload);

  return payload;
};

export const prepareLessonFromSeed = (
  lessonSeed,
  nameModifier = '',
  status = 'Public',
) => ({
  lesson: {
    name: `${lessonSeed.name}${nameModifier}`,
    status,
  },
  // eslint-disable-next-line no-underscore-dangle
  blocks: lessonSeed._blocks._current.map((structureItem) => {
    // eslint-disable-next-line no-underscore-dangle
    const lastRevision = structureItem._revisions[0];

    return {
      block_id: v4(),
      content: lastRevision.content,
      type: lastRevision.type,
      answer: lastRevision.answer,
      revision: v4(),
    };
  }),
});

export const prepareCourseFromSeed = ({
  seed,
  name = '',
  status = 'Public',
  lessons = [],
}) => ({
  course: {
    name: `${seed.name}${name}`,
    status,
  },
  lessons: [
    // eslint-disable-next-line no-underscore-dangle
    ...seed._lessons.map((structureItem) => ({
      id: structureItem.lesson_id,
    })),
    ...lessons,
  ],
});

export const prepareLessonsAndCourses = async (
  context,
  teacherCredentials,
  lessonStatuses,
  courseStatuses,
) => {
  const firstLesson = await createLesson({
    app: context.app,
    credentials: teacherCredentials,
    body: prepareLessonFromSeed(
      french,
      `-lesson${lessonStatuses[0]}`,
      lessonStatuses[0],
    ),
  });

  const secondLesson = await createLesson({
    app: context.app,
    credentials: teacherCredentials,
    body: prepareLessonFromSeed(
      russian,
      `-lesson${lessonStatuses[1]}`,
      lessonStatuses[1],
    ),
  });

  const firstCourse = await createCourse({
    app: context.app,
    credentials: teacherCredentials,
    body: prepareCourseFromSeed({
      seed: courseToTest,
      name: `-course${courseStatuses[0]}`,
      status: courseStatuses[0],
      lessons: [{ id: firstLesson.lesson.id }, { id: secondLesson.lesson.id }],
    }),
  });

  const secondCourse = await createCourse({
    app: context.app,
    credentials: teacherCredentials,
    body: prepareCourseFromSeed({
      seed: secondCourseToTest,
      name: `-course${courseStatuses[1]}`,
      status: courseStatuses[1],
      lessons: [{ id: firstLesson.lesson.id }],
    }),
  });

  return {
    lessons: [firstLesson, secondLesson],
    courses: [firstCourse, secondCourse],
  };
};
