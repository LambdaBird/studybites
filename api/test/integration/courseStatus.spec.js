import { defaultPassword, teacherMike } from '../../seeds/testData/users';

import { authorizeUser, prepareLessonsAndCourses } from './utils';
import { userServiceErrors as errors } from '../../src/config';
import build from '../../src/app';

describe('Change Course status flow', () => {
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

  it.each([
    [
      {
        statusGiven: 'Draft',
        statusAttempted: 'Public',
        lessonStatus: 'Draft',
      },
    ],
    [
      {
        statusGiven: 'Archived',
        statusAttempted: 'Public',
        lessonStatus: 'Draft',
      },
    ],
    [
      {
        statusGiven: 'Draft',
        statusAttempted: 'Public',
        lessonStatus: 'Archived',
      },
    ],
    [
      {
        statusGiven: 'Archived',
        statusAttempted: 'Public',
        lessonStatus: 'Archived',
      },
    ],
  ])(
    'should return error if try to change course status from %s to %s when one of lessons is %s',
    async ({ statusGiven, statusAttempted, lessonStatus }) => {
      const { courses } = await prepareLessonsAndCourses(
        context,
        teacherCredentials,
        [lessonStatus, 'Public'],
        [statusGiven, 'Draft'],
      );
      const [firstCourse] = courses;
      const response = await context.teacherRequest({
        url: `courses-management/courses/${firstCourse.course.id}/update-status`,
        method: 'PATCH',
        body: {
          status: statusAttempted,
        },
      });
      const payload = JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.USER_ERR_PUBLISH_RESTRICTED);
    },
  );

  it.each([
    [
      {
        statusGiven: 'Public',
        statusAttempted: 'Draft',
        lessonStatus: 'Public',
      },
    ],
    [
      {
        statusGiven: 'Public',
        statusAttempted: 'Draft',
        lessonStatus: 'Draft',
      },
    ],
    [
      {
        statusGiven: 'Public',
        statusAttempted: 'Draft',
        lessonStatus: 'Archived',
      },
    ],
    [
      {
        statusGiven: 'Public',
        statusAttempted: 'Archived',
        lessonStatus: 'Public',
      },
    ],
    [
      {
        statusGiven: 'Public',
        statusAttempted: 'Archived',
        lessonStatus: 'Draft',
      },
    ],
    [
      {
        statusGiven: 'Public',
        statusAttempted: 'Archived',
        lessonStatus: 'Archived',
      },
    ],
  ])(
    'should return success if try to change course status from %s to %s when lessons status is %s',
    async ({ statusGiven, statusAttempted, lessonStatus }) => {
      const { courses } = await prepareLessonsAndCourses(
        context,
        teacherCredentials,
        [lessonStatus, lessonStatus],
        [statusGiven, 'Draft'],
      );
      const [firstCourse] = courses;
      const response = await context.teacherRequest({
        url: `courses-management/courses/${firstCourse.course.id}/update-status`,
        method: 'PATCH',
        body: {
          status: statusAttempted,
        },
      });
      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload.status).toBe(statusAttempted);
    },
  );
});
