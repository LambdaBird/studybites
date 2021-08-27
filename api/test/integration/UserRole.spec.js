import build from '../../src/app';
import UserRole from '../../src/models/UserRole';

import {
  teacherMike,
  studentJohn,
  defaultPassword,
} from '../../seeds/testData/users';
import { french } from '../../seeds/testData/lessons';

import { authorizeUser, createLesson, prepareLessonFromSeed } from './utils';

describe('UserRole methods', () => {
  const testContext = {
    app: null,
    teacherToken: null,
    studentToken: null,
    teacherRequest: async () => {},
    studentRequest: async () => {},
  };

  const teacherCredentials = {
    email: teacherMike.email,
    password: defaultPassword,
  };
  const studentCredentials = {
    email: studentJohn.email,
    password: defaultPassword,
  };

  beforeAll(async () => {
    testContext.app = build();

    await authorizeUser({
      credentials: teacherCredentials,
      app: testContext.app,
      setToken: (token) => {
        testContext.teacherToken = token;
      },
    });
    await authorizeUser({
      credentials: studentCredentials,
      app: testContext.app,
      setToken: (token) => {
        testContext.studentToken = token;
      },
    });

    testContext.teacherRequest = async ({ url, method = 'POST', body }) => {
      return testContext.app.inject({
        method,
        url: `/api/v1/${url}`,
        headers: {
          authorization: `Bearer ${testContext.teacherToken}`,
        },
        body,
      });
    };
    testContext.studentRequest = async ({ url, method = 'POST', body }) => {
      return testContext.app.inject({
        method,
        url: `/api/v1/${url}`,
        headers: {
          authorization: `Bearer ${testContext.studentToken}`,
        },
        body,
      });
    };
  });

  afterAll(async () => {
    await testContext.app.close();
  });

  describe('getLessonStudentsCount method - get students count by lessonId', () => {
    describe('count when no one had enrolled', () => {
      let noEnrolled;

      beforeAll(async () => {
        noEnrolled = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareLessonFromSeed(french),
        });
      });

      it('should be zero', async () => {
        const { count } = await UserRole.getLessonStudentsCount({
          lessonId: noEnrolled.lesson.id,
        });

        expect(typeof +count).toBe('number');
        expect(+count).toBe(0);
      });
    });

    describe('count when student had enrolled', () => {
      let oneEnrolled;

      beforeAll(async () => {
        oneEnrolled = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareLessonFromSeed(french),
        });

        await testContext.studentRequest({
          url: `lessons/${oneEnrolled.lesson.id}/enroll`,
        });
      });

      it('should be one', async () => {
        const { count } = await UserRole.getLessonStudentsCount({
          lessonId: oneEnrolled.lesson.id,
        });

        expect(typeof +count).toBe('number');
        expect(+count).toBe(1);
      });
    });

    describe('count when self enrolled', () => {
      let selfEnrolled;

      beforeAll(async () => {
        selfEnrolled = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareLessonFromSeed(french),
        });

        await testContext.teacherRequest({
          url: `lessons/${selfEnrolled.lesson.id}/enroll`,
        });
      });

      it('should be one', async () => {
        const { count } = await UserRole.getLessonStudentsCount({
          lessonId: selfEnrolled.lesson.id,
        });

        expect(typeof +count).toBe('number');
        expect(+count).toBe(1);
      });
    });
  });
});
