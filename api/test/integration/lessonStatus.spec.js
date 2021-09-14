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
        context.teacherToken = accessToken;
      },
    });

    context.teacherRequest = async ({ url, method = 'POST', body }) => {
      return context.app.inject({
        method,
        url: `/api/v1/${url}`,
        headers: {
          Authorization: `Bearer ${context.teacherToken}`,
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
    const response = await context.teacherRequest({
      url: `lessons-management/lessons/${firstLesson.lesson.id}/update-status`,
      method: 'PATCH',
      body: {
        status: 'Draft',
      },
    });
    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload.status).toBe('Draft');
  });

  it('should return an error if try to change lesson status from Public to Draft when courses status is Public', async () => {
    const { lessons } = await prepareLessonsAndCourses(
      context,
      teacherCredentials,
      ['Public', 'Draft'],
      ['Public', 'Public'],
    );
    const [firstLesson] = lessons;
    const response = await context.teacherRequest({
      url: `lessons-management/lessons/${firstLesson.lesson.id}/update-status`,
      method: 'PATCH',
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
    [{ statusGiven: 'Public', statusAttempted: 'Draft' }],
    [{ statusGiven: 'Public', statusAttempted: 'Archived' }],
    [{ statusGiven: 'Draft', statusAttempted: 'Archived' }],
    [{ statusGiven: 'Archived', statusAttempted: 'Draft' }],
  ])(
    'should return success if try to change lesson status from %s to %s after courses change their status',
    async ({ statusGiven, statusAttempted }) => {
      const { lessons } = await prepareLessonsAndCourses(
        context,
        teacherCredentials,
        [statusGiven, 'Public'],
        ['Public', 'Public'],
      );
      const [firstLesson] = lessons;

      const lessonResponse = await context.teacherRequest({
        url: `lessons-management/lessons/${firstLesson.lesson.id}/update-status`,
        method: 'PATCH',
        body: {
          status: statusAttempted,
        },
      });
      const payload = JSON.parse(lessonResponse.payload);
      const { courses } = payload.payload;
      const statusToChange = payload.payload.status;
      const coursesResponse = await context.teacherRequest({
        url: `courses-management/courses/update-status`,
        method: 'PATCH',
        body: {
          status: statusToChange,
          courses,
        },
      });
      const lessonSecondResponse = await context.teacherRequest({
        url: `lessons-management/lessons/${firstLesson.lesson.id}/update-status`,
        method: 'PATCH',
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
