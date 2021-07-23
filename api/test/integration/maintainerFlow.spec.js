import { v4 } from 'uuid';

import build from '../../src/app';

import { UNAUTHORIZED } from '../../src/services/user/constants';
import { INVALID_STATUS } from '../../src/services/lesson/constants';

import {
  teacherMike,
  teacherNathan,
  defaultPassword,
  studentJohn,
} from '../../seeds/testData/users';
import { french } from '../../seeds/testData/lessons';

import { authorizeUser, createLesson, prepareLessonFromSeed } from './utils';

describe('Maintainer flow', () => {
  const testContext = {};

  const teacherCredentials = {
    email: teacherMike.email,
    password: defaultPassword,
  };

  const anotherTeacherCredentials = {
    email: teacherNathan.email,
    password: defaultPassword,
  };

  beforeAll(async () => {
    testContext.app = build();

    await authorizeUser({
      credentials: teacherCredentials,
      app: testContext.app,
      setToken: (accessToken) => {
        testContext.token = accessToken;
      },
    });

    await authorizeUser({
      credentials: anotherTeacherCredentials,
      app: testContext.app,
      setToken: (accessToken) => {
        testContext.anotherToken = accessToken;
      },
    });

    await authorizeUser({
      credentials: {
        email: studentJohn.email,
        password: defaultPassword,
      },
      app: testContext.app,
      setToken: (accessToken) => {
        testContext.studentToken = accessToken;
      },
    });

    testContext.request = async ({ url, method = 'POST', body }) => {
      return testContext.app.inject({
        method,
        url: `/api/v1/${url}`,
        headers: {
          Authorization: `Bearer ${testContext.token}`,
        },
        body,
      });
    };

    testContext.anotherRequest = async ({ url, method = 'POST', body }) => {
      return testContext.app.inject({
        method,
        url: `/api/v1/${url}`,
        headers: {
          Authorization: `Bearer ${testContext.anotherToken}`,
        },
        body,
      });
    };

    testContext.studentRequest = async ({ url, method = 'POST', body }) => {
      return testContext.app.inject({
        method,
        url: `/api/v1/${url}`,
        headers: {
          Authorization: `Bearer ${testContext.studentToken}`,
        },
        body,
      });
    };
  });

  afterAll(async () => {
    await testContext.app.close();
  });

  describe('Create a lesson', () => {
    it('should return an error if the user is not a teacher', async () => {
      const response = await testContext.studentRequest({
        url: 'lesson/maintain/',
        body: prepareLessonFromSeed(french, '-notCreated'),
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(401);
      expect(payload.errors[0]).toMatchObject(UNAUTHORIZED);
    });

    it('should return a lesson with blocks', async () => {
      const response = await testContext.request({
        url: 'lesson/maintain/',
        body: prepareLessonFromSeed(french, '-lessonToCreate'),
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('lesson');
      expect(payload.lesson).toHaveProperty('blocks');
      expect(payload.lesson.blocks).toBeInstanceOf(Array);
      // eslint-disable-next-line no-underscore-dangle
      expect(payload.lesson.blocks.length).toBe(french._blocks._current.length);
    });
  });

  describe('Create a lesson with different statuses', () => {
    it('lesson status should be "Draft" by default', async () => {
      const response = await testContext.request({
        url: 'lesson/maintain/',
        body: {
          lesson: {
            name: 'New lesson',
          },
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('lesson');
      expect(payload.lesson).toHaveProperty('status');
      expect(payload.lesson.status).toBe('Draft');
    });

    it('should return an error for invalid status', async () => {
      const response = await testContext.request({
        url: 'lesson/maintain/',
        body: {
          lesson: {
            name: 'New lesson',
            status: 'Totally invalid',
          },
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.errors[0]).toMatchObject(INVALID_STATUS);
    });
  });

  describe('Update a lesson', () => {
    let lessonToUpdate;

    beforeAll(async () => {
      lessonToUpdate = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-lessonToUpdate'),
      });
    });

    it('should return an error if the user is not a teacher', async () => {
      const response = await testContext.studentRequest({
        url: `lesson/maintain/${lessonToUpdate.lesson.id}`,
        method: 'PUT',
        body: {},
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(401);
      expect(payload.errors[0]).toMatchObject(UNAUTHORIZED);
    });

    it('should return a lesson with a new name', async () => {
      const name = 'New name for the lesson';

      const response = await testContext.request({
        url: `lesson/maintain/${lessonToUpdate.lesson.id}`,
        method: 'PUT',
        body: {
          lesson: {
            name,
          },
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('lesson');
      expect(payload.lesson).toHaveProperty('name');
      expect(payload.lesson.name).toBe(name);
    });
  });

  describe('Update lessons blocks', () => {
    let lessonToUpdate;

    beforeAll(async () => {
      lessonToUpdate = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french),
      });
    });

    it('should return an unchanged lesson with new blocks', async () => {
      const blocks = [
        {
          revision: v4(),
        },
      ];

      const response = await testContext.request({
        url: `lesson/maintain/${lessonToUpdate.lesson.id}`,
        method: 'PUT',
        body: {
          blocks,
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('lesson');
      expect(payload.lesson).toHaveProperty('blocks');
      expect(payload.lesson).toHaveProperty('name');
      expect(payload.lesson.name).toBe(french.name);
      expect(payload.lesson).toHaveProperty('status');
      expect(payload.lesson.status).toBe(french.status);
      expect(payload.lesson.blocks).toBeInstanceOf(Array);
      expect(payload.lesson.blocks.length).toBe(blocks.length);
    });
  });

  describe('Get all maintainable lessons', () => {
    it('should return an error if the user is not a teacher', async () => {
      const response = await testContext.studentRequest({
        method: 'GET',
        url: 'lesson/maintain/',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(401);
      expect(payload.errors[0]).toMatchObject(UNAUTHORIZED);
    });

    it('should return no lessons if user does not have any lessons', async () => {
      const response = await testContext.anotherRequest({
        method: 'GET',
        url: 'lesson/maintain/',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lessons');
      expect(payload.total).toBe(0);
    });

    it('should return lessons with total count', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: 'lesson/maintain/',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lessons');
    });
  });

  describe('Search through maintainable lessons', () => {
    let lessonToSearch;

    beforeAll(async () => {
      lessonToSearch = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-uniqueIdentifier'),
      });
    });

    it('should return one lesson by name', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: `lesson/maintain/?search=${lessonToSearch.lesson.name}`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lessons');
      expect(payload.total).toBe(1);
    });

    it('should return no lessons', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: 'lesson/maintain/?search=nomatchstring',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lessons');
      expect(payload.total).toBe(0);
    });
  });

  describe('Get maintainable lesson by id', () => {
    let lessonToGet;
    let notMaintainableLesson;

    beforeAll(async () => {
      lessonToGet = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-lessonToGet'),
      });

      notMaintainableLesson = await createLesson({
        app: testContext.app,
        credentials: anotherTeacherCredentials,
        body: prepareLessonFromSeed(french, '-notMaintainable'),
      });

      await testContext.studentRequest({
        url: `lesson/enroll/${lessonToGet.lesson.id}`,
      });
    });

    it('should return an error if the user is not a teacher', async () => {
      const response = await testContext.studentRequest({
        url: `lesson/maintain/${lessonToGet.lesson.id}`,
        method: 'GET',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(401);
      expect(payload.errors[0]).toMatchObject(UNAUTHORIZED);
    });

    it('should return an error if the user is not a maintainer of this lesson', async () => {
      const response = await testContext.studentRequest({
        url: `lesson/maintain/${notMaintainableLesson.lesson.id}`,
        method: 'GET',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(401);
      expect(payload.errors[0]).toMatchObject(UNAUTHORIZED);
    });

    it('should return a lesson with blocks and students count', async () => {
      const response = await testContext.request({
        url: `lesson/maintain/${lessonToGet.lesson.id}`,
        method: 'GET',
      });
      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('lesson');

      expect(payload.lesson).toHaveProperty('studentsCount');
      expect(typeof payload.lesson.studentsCount).toBe('number');
      expect(payload.lesson.studentsCount).toBe(1);

      expect(payload.lesson).toHaveProperty('blocks');
      expect(payload.lesson.blocks).toBeInstanceOf(Array);
      // eslint-disable-next-line no-underscore-dangle
      expect(payload.lesson.blocks.length).toBe(french._blocks._current.length);
    });
  });

  describe('Get all students enrolled to maintainable lessons', () => {
    it('should return an error if the user is not a teacher', async () => {
      const response = await testContext.studentRequest({
        method: 'GET',
        url: 'lesson/maintain/students',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(401);
      expect(payload.errors[0]).toMatchObject(UNAUTHORIZED);
    });

    it('should return students with total count', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: 'lesson/maintain/students',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('students');
    });
  });

  describe('Search through all students enrolled to maintainable lessons', () => {
    beforeAll(async () => {
      const lessonToEnroll = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french),
      });

      await testContext.studentRequest({
        url: `lesson/enroll/${lessonToEnroll.lesson.id}`,
      });
    });

    it('should return one student by name', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: `lesson/maintain/students?search=${studentJohn.first_name}`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('students');
      expect(payload.total).toBe(1);
    });

    it('should return no students', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: 'lesson/maintain/students?search=nomatchstring',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('students');
      expect(payload.total).toBe(0);
    });
  });

  describe('Get all students enrolled to lesson', () => {
    let lessonToGetStudents;

    beforeAll(async () => {
      lessonToGetStudents = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-lessonToGetStudents'),
      });

      await testContext.request({
        url: `lesson/enroll/${lessonToGetStudents.lesson.id}`,
      });
    });

    it('should return an error if the user is not a teacher', async () => {
      const response = await testContext.studentRequest({
        method: 'GET',
        url: `lesson/enrolled/${lessonToGetStudents.lesson.id}`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(401);
      expect(payload.errors[0]).toMatchObject(UNAUTHORIZED);
    });

    it('should return students with total count', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: `lesson/enrolled/${lessonToGetStudents.lesson.id}`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('students');
    });
  });

  describe('Search through all students enrolled to lesson', () => {
    let lessonToSearchStudents;

    beforeAll(async () => {
      lessonToSearchStudents = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-lessonToSearchStudents'),
      });

      await testContext.request({
        url: `lesson/enroll/${lessonToSearchStudents.lesson.id}`,
      });
    });

    it('should return one student by name', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: `lesson/enrolled/${lessonToSearchStudents.lesson.id}?search=${studentJohn.first_name}`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('students');
      expect(payload.total).toBe(1);
    });

    it('should return no students', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: `lesson/enrolled/${lessonToSearchStudents.lesson.id}?search=nomatchstring`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('students');
      expect(payload.total).toBe(0);
    });
  });

  describe('Get all possible lesson statuses', () => {
    it('should return an array of statuses', async () => {
      const response = await testContext.request({
        method: 'OPTIONS',
        url: 'lesson',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('properties');
    });
  });
});
