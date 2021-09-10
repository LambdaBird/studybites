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

  it.each([
    ['Draft', 'Public', 'Draft'],
    ['Archived', 'Public', 'Draft'],
    ['Draft', 'Public', 'Archived'],
    ['Archived', 'Public', 'Archived'],
  ])(
    'should return error if try to change course status from %s to %s when one of lessons is %s',
    async (fromStatus, toStatus, lessonStatus) => {
      const { courses } = await prepareLessonsAndCourses(
        context,
        teacherCredentials,
        [lessonStatus, 'Public'],
        [fromStatus, 'Draft'],
      );
      const [firstCourse] = courses;
      const response = await context.request({
        url: `courses-management/courses/${firstCourse.course.id}/status`,
        method: 'PUT',
        body: {
          status: toStatus,
        },
      });
      const payload = JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.USER_ERR_PUBLISH_RESTRICTED);
    },
  );

  it.each([
    ['Public', 'Draft', 'Public'],
    ['Public', 'Draft', 'Draft'],
    ['Public', 'Draft', 'Archived'],
    ['Public', 'Archived', 'Public'],
    ['Public', 'Archived', 'Draft'],
    ['Public', 'Archived', 'Archived'],
  ])(
    'should return success if try to change course status from %s to %s when lessons status is %s',
    async (fromStatus, toStatus, lessonStatus) => {
      const { courses } = await prepareLessonsAndCourses(
        context,
        teacherCredentials,
        [lessonStatus],
        [fromStatus, 'Draft'],
      );
      const [firstCourse] = courses;
      const response = await context.request({
        url: `courses-management/courses/${firstCourse.course.id}/status`,
        method: 'PUT',
        body: {
          status: toStatus,
        },
      });
      expect(response.statusCode).toBe(200);
    },
  );
});
