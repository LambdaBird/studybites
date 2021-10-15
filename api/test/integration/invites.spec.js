import build from '../../src/app';

import {
  teacherMike,
  studentJohn,
  defaultPassword,
} from '../../seeds/testData/users';
import { authorizeUser, createLesson } from './utils';
import { lessonServiceErrors, lessonServiceMessages } from '../../src/config';

describe('Invites service test', () => {
  const testContext = {
    app: null,
    teachersToken: null,
    studentsToken: null,
    teachersRequest: () => {},
    studentsRequest: () => {},
  };

  const teachersCredentials = {
    email: teacherMike.email,
    password: defaultPassword,
  };

  const studentsCredentials = {
    email: studentJohn.email,
    password: defaultPassword,
  };

  beforeAll(async () => {
    testContext.app = build();

    await authorizeUser({
      credentials: teachersCredentials,
      app: testContext.app,
      setToken: (token) => {
        testContext.teachersToken = token;
      },
    });
    await authorizeUser({
      credentials: studentsCredentials,
      app: testContext.app,
      setToken: (token) => {
        testContext.studentsToken = token;
      },
    });

    testContext.teachersRequest = ({ url, method = 'POST', body }) => {
      return testContext.app.inject({
        method,
        url: `/api/v1/${url}`,
        headers: {
          authorization: `Bearer ${testContext.teachersToken}`,
        },
        body,
      });
    };
    testContext.studentsRequest = ({ url, method = 'POST', body }) => {
      return testContext.app.inject({
        method,
        url: `/api/v1/${url}`,
        headers: {
          authorization: `Bearer ${testContext.studentsToken}`,
        },
        body,
      });
    };
  });

  afterAll(async () => {
    await testContext.app.close();
  });

  describe('Private lesson should not be enrollable without an invite', () => {
    let lessonToEnroll;

    beforeAll(async () => {
      lessonToEnroll = await createLesson({
        app: testContext.app,
        credentials: teachersCredentials,
        body: {
          lesson: {
            name: 'Private Lesson',
            status: 'Private',
          },
        },
      });
    });

    it('should return an error', async () => {
      const response = await testContext.studentsRequest({
        url: `lessons/${lessonToEnroll.lesson.id}/enroll`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload).toHaveProperty('message');
      expect(payload.message).toBe(lessonServiceErrors.LESSON_ERR_FAIL_ENROLL);
    });
  });

  describe('Creation of a general link', () => {
    let lessonToInvite;

    beforeAll(async () => {
      lessonToInvite = await createLesson({
        app: testContext.app,
        credentials: teachersCredentials,
        body: {
          lesson: {
            name: 'Private Lesson',
            status: 'Private',
          },
        },
      });
    });

    it('should successfully create a link', async () => {
      const response = await testContext.teachersRequest({
        url: `invites`,
        body: {
          resourceId: lessonToInvite.lesson.id,
          resourceType: 'lesson',
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('invites');
      expect(payload.invites[0]).toMatchObject({
        email: null,
        invite: expect.any(String),
      });
    });
  });

  describe('Enroll with a general link', () => {
    let lessonToEnroll;
    let invite;

    beforeAll(async () => {
      lessonToEnroll = await createLesson({
        app: testContext.app,
        credentials: teachersCredentials,
        body: {
          lesson: {
            name: 'Private Lesson',
            status: 'Private',
          },
        },
      });

      const response = await testContext.teachersRequest({
        url: `invites`,
        body: {
          resourceId: lessonToEnroll.lesson.id,
          resourceType: 'lesson',
        },
      });

      const { invites } = JSON.parse(response.payload);
      invite = invites[0].invite;
    });

    it('should be enrollable', async () => {
      const response = await testContext.studentsRequest({
        url: `lessons/${lessonToEnroll.lesson.id}/enroll`,
        body: {
          invite,
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('message');
      expect(payload.message).toBe(
        lessonServiceMessages.LESSON_MSG_SUCCESS_ENROLL,
      );
    });
  });

  describe('Enroll with an invalid invite', () => {
    let lessonToEnroll;
    let lessonToInvite;
    let invite;

    beforeAll(async () => {
      lessonToEnroll = await createLesson({
        app: testContext.app,
        credentials: teachersCredentials,
        body: {
          lesson: {
            name: 'Private Lesson',
            status: 'Private',
          },
        },
      });
      lessonToInvite = await createLesson({
        app: testContext.app,
        credentials: teachersCredentials,
        body: {
          lesson: {
            name: 'Private Lesson',
            status: 'Private',
          },
        },
      });

      const response = await testContext.teachersRequest({
        url: `invites`,
        body: {
          resourceId: lessonToInvite.lesson.id,
          resourceType: 'lesson',
        },
      });

      const { invites } = JSON.parse(response.payload);
      invite = invites[0].invite;
    });

    it('should return an error', async () => {
      const response = await testContext.studentsRequest({
        url: `lessons/${lessonToEnroll.lesson.id}/enroll`,
        body: {
          invite,
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload).toHaveProperty('message');
      expect(payload.message).toBe(lessonServiceErrors.LESSON_ERR_FAIL_ENROLL);
    });
  });

  describe('Creation of an invite with an email', () => {
    let lessonToInvite;

    beforeAll(async () => {
      lessonToInvite = await createLesson({
        app: testContext.app,
        credentials: teachersCredentials,
        body: {
          lesson: {
            name: 'Private Lesson',
            status: 'Private',
          },
        },
      });
    });

    it('should successfully create a link', async () => {
      const response = await testContext.teachersRequest({
        url: `invites`,
        body: {
          resourceId: lessonToInvite.lesson.id,
          resourceType: 'lesson',
          emails: [studentJohn.email],
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('invites');
      expect(payload.invites[0]).toMatchObject({
        email: studentJohn.email,
        invite: expect.any(String),
      });
    });
  });

  describe('Enroll with an invite', () => {
    let lessonToEnroll;
    let invite;

    beforeAll(async () => {
      lessonToEnroll = await createLesson({
        app: testContext.app,
        credentials: teachersCredentials,
        body: {
          lesson: {
            name: 'Private Lesson',
            status: 'Private',
          },
        },
      });

      const response = await testContext.teachersRequest({
        url: `invites`,
        body: {
          resourceId: lessonToEnroll.lesson.id,
          resourceType: 'lesson',
          emails: [studentJohn.email],
        },
      });

      const { invites } = JSON.parse(response.payload);
      invite = invites[0].invite;
    });

    it('should be enrollable', async () => {
      const response = await testContext.studentsRequest({
        url: `lessons/${lessonToEnroll.lesson.id}/enroll`,
        body: {
          invite,
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('message');
      expect(payload.message).toBe(
        lessonServiceMessages.LESSON_MSG_SUCCESS_ENROLL,
      );
    });
  });

  describe('Enroll with an invalid invite', () => {
    let lessonToEnroll;
    let invite;

    beforeAll(async () => {
      lessonToEnroll = await createLesson({
        app: testContext.app,
        credentials: teachersCredentials,
        body: {
          lesson: {
            name: 'Private Lesson',
            status: 'Private',
          },
        },
      });

      const response = await testContext.teachersRequest({
        url: `invites`,
        body: {
          resourceId: lessonToEnroll.lesson.id,
          resourceType: 'lesson',
          emails: ['student@test.io'],
        },
      });

      const { invites } = JSON.parse(response.payload);
      invite = invites[0].invite;
    });

    it('should return an error', async () => {
      const response = await testContext.studentsRequest({
        url: `lessons/${lessonToEnroll.lesson.id}/enroll`,
        body: {
          invite,
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload).toHaveProperty('message');
      expect(payload.message).toBe(lessonServiceErrors.LESSON_ERR_FAIL_ENROLL);
    });
  });

  describe('Revoking an invite by creating a new one', () => {
    let lessonToEnroll;
    let revokedInvite;
    let workingInvite;

    beforeAll(async () => {
      lessonToEnroll = await createLesson({
        app: testContext.app,
        credentials: teachersCredentials,
        body: {
          lesson: {
            name: 'Private Lesson',
            status: 'Private',
          },
        },
      });

      const revokedInviteResponse = await testContext.teachersRequest({
        url: `invites`,
        body: {
          resourceId: lessonToEnroll.lesson.id,
          resourceType: 'lesson',
          emails: [studentJohn.email],
        },
      });

      const { invites: revokedInvitesPayload } = JSON.parse(
        revokedInviteResponse.payload,
      );
      revokedInvite = revokedInvitesPayload[0].invite;

      const workingInviteResponse = await testContext.teachersRequest({
        url: `invites`,
        body: {
          resourceId: lessonToEnroll.lesson.id,
          resourceType: 'lesson',
          emails: [studentJohn.email],
        },
      });

      const { invites: workingInvitePayload } = JSON.parse(
        workingInviteResponse.payload,
      );
      workingInvite = workingInvitePayload[0].invite;
    });

    it('should return an error if enroll with a revoked invite', async () => {
      const response = await testContext.studentsRequest({
        url: `lessons/${lessonToEnroll.lesson.id}/enroll`,
        body: {
          invite: revokedInvite,
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload).toHaveProperty('message');
      expect(payload.message).toBe(lessonServiceErrors.LESSON_ERR_FAIL_ENROLL);
    });

    it('should successfully enroll with a working invite', async () => {
      const response = await testContext.studentsRequest({
        url: `lessons/${lessonToEnroll.lesson.id}/enroll`,
        body: {
          invite: workingInvite,
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('message');
      expect(payload.message).toBe(
        lessonServiceMessages.LESSON_MSG_SUCCESS_ENROLL,
      );
    });
  });
});
