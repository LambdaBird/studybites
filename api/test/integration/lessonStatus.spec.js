import { defaultPassword, teacherMike } from '../../seeds/testData/users';

import { authorizeUser, prepareLessonsAndCourses } from './utils';

import { userServiceErrors as errors } from '../../src/config';
import build from '../../src/app';

describe('Change Lesson status flow', () => {
  const context = {};

  const teacherCredentials = {
    email: teacherMike.email,
    password: defaultPassword,
  };

  beforeAll(async () => {
    context.app = build();
    await authorizeUser({
      credentials: teacherCredentials,
      app: context.app,
      setToken: (accessToken) => {
        context.token = accessToken;
      },
    });

    context.request = async ({ url, method = 'POST', body }) => {
      return context.app.inject({
        method,
        url: `/api/v1/${url}`,
        headers: {
          Authorization: `Bearer ${context.token}`,
        },
        body,
      });
    };
  });

  afterAll(async () => {
    await context.app.close();
  });

  it('should return success if try to change lesson status from Public to Draft when courses status is Draft', async () => {
    const { lessons } = await prepareLessonsAndCourses(
      context,
      teacherCredentials,
      ['Public', 'Draft'],
      ['Draft', 'Draft'],
    );
    const [firstLesson] = lessons;
    const response = await context.request({
      url: `lessons-management/lessons/${firstLesson.lesson.id}/status`,
      method: 'PUT',
      body: {
        status: 'Draft',
      },
    });
    expect(response.statusCode).toBe(200);
  });

  it('should return an error if try to change lesson status from Public to Draft when courses status is Public', async () => {
    const { lessons } = await prepareLessonsAndCourses(
      context,
      teacherCredentials,
      ['Public', 'Draft'],
      ['Public', 'Public'],
    );
    const [firstLesson] = lessons;
    const response = await context.request({
      url: `lessons-management/lessons/${firstLesson.lesson.id}/status`,
      method: 'PUT',
      body: {
        status: 'Draft',
      },
    });

    const payload = JSON.parse(response.payload);
    expect(response.statusCode).toBe(400);
    expect(payload.statusCode).toBe(400);
    expect(payload.message).toBe(errors.USER_ERR_COURSES_RESTRICTED);
  });

  it.each([
    ['Public', 'Draft'],
    ['Public', 'Archived'],
    ['Draft', 'Archived'],
    ['Archived', 'Draft'],
  ])(
    'should return success if try to change lesson status from %s to %s after courses change their status',
    async (statusFrom, statusTo) => {
      const { lessons } = await prepareLessonsAndCourses(
        context,
        teacherCredentials,
        [statusFrom, 'Public'],
        ['Public', 'Public'],
      );
      const [firstLesson] = lessons;

      const lessonResponse = await context.request({
        url: `lessons-management/lessons/${firstLesson.lesson.id}/status`,
        method: 'PUT',
        body: {
          status: statusTo,
        },
      });
      const payload = JSON.parse(lessonResponse.payload);
      const { courses } = payload.payload;
      const statusToChange = payload.payload.status;
      const coursesResponse = await context.request({
        url: `courses-management/courses/status`,
        method: 'PUT',
        body: {
          status: statusToChange,
          courses,
        },
      });
      const lessonSecondResponse = await context.request({
        url: `lessons-management/lessons/${firstLesson.lesson.id}/status`,
        method: 'PUT',
        body: {
          status: statusToChange,
        },
      });

      expect(lessonResponse.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.USER_ERR_COURSES_RESTRICTED);

      expect(coursesResponse.statusCode).toBe(200);

      const lessonSecondResponsePayload = JSON.parse(
        lessonSecondResponse.payload,
      );
      expect(lessonSecondResponse.statusCode).toBe(200);
      expect(lessonSecondResponsePayload).toStrictEqual({
        status: statusToChange,
      });
    },
  );
});
