import build from '../../src/app';

import {
  teacherMike,
  teacherNathan,
  defaultPassword,
  studentJohn,
} from '../../seeds/testData/users';
import { courseToTest } from '../../seeds/testData/courses';

import { authorizeUser, createCourse, prepareCourseFromSeed } from './utils';

import { userServiceErrors as errors } from '../../src/config';

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
        url: `/api/v1/courses-management/${url}`,
        headers: {
          Authorization: `Bearer ${testContext.token}`,
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

  describe('Create a course', () => {
    it('should return an error if the user is not a teacher', async () => {
      const response = await testContext.studentRequest({
        url: 'courses-management/courses',
        body: prepareCourseFromSeed(courseToTest, '-notCreated'),
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(401);
      expect(payload.statusCode).toBe(401);
      expect(payload.message).toBe(errors.USER_ERR_UNAUTHORIZED);
    });

    it('should return a course with lessons', async () => {
      const response = await testContext.request({
        url: 'courses',
        body: prepareCourseFromSeed(courseToTest, '-courseToCreate'),
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('course');
      expect(payload.course).toHaveProperty('lessons');
      expect(payload.course.lessons).toBeInstanceOf(Array);
      // eslint-disable-next-line no-underscore-dangle
      expect(payload.course.lessons.length).toBe(courseToTest._lessons.length);
    });
  });

  describe('Create a course with different statuses', () => {
    it('course status should be "Draft" by default', async () => {
      const response = await testContext.request({
        url: 'courses',
        body: {
          course: {
            name: 'New course',
          },
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('course');
      expect(payload.course).toHaveProperty('status');
      expect(payload.course.status).toBe('Draft');
    });

    it('should return an error for invalid status', async () => {
      const response = await testContext.request({
        url: 'courses',
        body: {
          course: {
            name: 'New course',
            status: 'Totally invalid',
          },
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe('validation.enum.course.status');
    });
  });

  describe('Update a course', () => {
    let courseToUpdate;

    beforeAll(async () => {
      courseToUpdate = await createCourse({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareCourseFromSeed(courseToTest, '-courseToUpdate'),
      });
    });

    it('should return an error if the user is not a teacher', async () => {
      const response = await testContext.studentRequest({
        url: `courses-management/courses/${courseToUpdate.course.id}`,
        method: 'PUT',
        body: {},
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(401);
      expect(payload.statusCode).toBe(401);
      expect(payload.message).toBe(errors.USER_ERR_UNAUTHORIZED);
    });

    it('should return a course with a new name', async () => {
      const name = 'New name for the course';

      const response = await testContext.request({
        url: `courses/${courseToUpdate.course.id}`,
        method: 'PUT',
        body: {
          course: {
            name,
          },
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('course');
      expect(payload.course).toHaveProperty('name');
      expect(payload.course.name).toBe(name);
    });
  });

  describe('Update courses lessons', () => {
    let courseToUpdate;

    beforeAll(async () => {
      courseToUpdate = await createCourse({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareCourseFromSeed(courseToTest),
      });
    });

    it('should return an unchanged course with new lessons', async () => {
      const lessons = [
        {
          id: 200,
        },
      ];

      const response = await testContext.request({
        url: `courses/${courseToUpdate.course.id}`,
        method: 'PUT',
        body: {
          lessons,
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('course');
      expect(payload.course).toHaveProperty('lessons');
      expect(payload.course).toHaveProperty('name');
      expect(payload.course.name).toBe(courseToUpdate.course.name);
      expect(payload.course).toHaveProperty('status');
      expect(payload.course.status).toBe(courseToUpdate.course.status);
      expect(payload.course.lessons).toBeInstanceOf(Array);
      expect(payload.course.lessons.length).toBe(lessons.length);
    });
  });

  describe('Get all maintainable courses', () => {
    it('should return an error if the user is not a teacher', async () => {
      const response = await testContext.studentRequest({
        method: 'GET',
        url: 'courses-management/courses',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(401);
      expect(payload.statusCode).toBe(401);
      expect(payload.message).toBe(errors.USER_ERR_UNAUTHORIZED);
    });

    it('should return courses with total count', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: 'courses',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('courses');
    });
  });

  describe('Search through maintainable courses', () => {
    let courseToSearch;

    beforeAll(async () => {
      courseToSearch = await createCourse({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareCourseFromSeed(courseToTest, '-newUniqueIdentifier'),
      });
    });

    it('should return one course by name', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: `courses?search=${courseToSearch.course.name}`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('courses');
      expect(payload.total).toBe(1);
    });

    it('should return no courses', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: 'courses?search=nomatchstring',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('courses');
      expect(payload.total).toBe(0);
    });
  });

  describe('Get maintainable course by id', () => {
    let courseToGet;
    let notMaintainableCourse;

    beforeAll(async () => {
      courseToGet = await createCourse({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareCourseFromSeed(courseToTest, '-courseToGet'),
      });

      notMaintainableCourse = await createCourse({
        app: testContext.app,
        credentials: anotherTeacherCredentials,
        body: prepareCourseFromSeed(courseToTest, '-notMaintainable'),
      });
    });

    it('should return an error if the user is not a teacher', async () => {
      const response = await testContext.studentRequest({
        url: `courses-management/courses/${courseToGet.course.id}`,
        method: 'GET',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(401);
      expect(payload.statusCode).toBe(401);
      expect(payload.message).toBe(errors.USER_ERR_UNAUTHORIZED);
    });

    it('should return an error if the user is not a maintainer of this course', async () => {
      const response = await testContext.studentRequest({
        url: `courses-management/courses/${notMaintainableCourse.course.id}`,
        method: 'GET',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(401);
      expect(payload.statusCode).toBe(401);
      expect(payload.message).toBe(errors.USER_ERR_UNAUTHORIZED);
    });

    it('should return a course with lessons and students count', async () => {
      const response = await testContext.request({
        url: `courses/${courseToGet.course.id}`,
        method: 'GET',
      });
      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('course');

      expect(payload.course).toHaveProperty('studentsCount');
      expect(typeof payload.course.studentsCount).toBe('number');
      expect(payload.course.studentsCount).toBe(0);

      expect(payload.course).toHaveProperty('lessons');
      expect(payload.course.lessons).toBeInstanceOf(Array);
      // eslint-disable-next-line no-underscore-dangle
      expect(payload.course.lessons.length).toBe(courseToTest._lessons.length);
    });
  });
});
