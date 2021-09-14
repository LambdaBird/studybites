import build from '../../src/app';

import { courseToTest } from '../../seeds/testData/courses';
import {
  teacherMike,
  studentJohn,
  defaultPassword,
} from '../../seeds/testData/users';

import { authorizeUser, createCourse, prepareCourseFromSeed } from './utils';

describe('Courses service', () => {
  const testContext = {};

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
      credentials: studentCredentials,
      app: testContext.app,
      setToken: (accessToken) => {
        testContext.token = accessToken;
      },
    });

    await authorizeUser({
      credentials: teacherCredentials,
      app: testContext.app,
      setToken: (accessToken) => {
        testContext.teacherToken = accessToken;
      },
    });

    testContext.request = async ({ url, method = 'POST', body }) => {
      return testContext.app.inject({
        method,
        url: `/api/v1/courses/${url}`,
        headers: {
          Authorization: `Bearer ${testContext.token}`,
        },
        body,
      });
    };
  });

  afterAll(async () => {
    await testContext.app.close();
  });

  describe('Get public courses', () => {
    it('should return courses with author', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: '',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('courses');
      expect(payload.courses[0]).toHaveProperty('author');
      expect(payload.courses[0].author).toBeInstanceOf(Object);
      expect(payload.courses[0].author).toHaveProperty('id');
      expect(payload.courses[0].author).toHaveProperty('firstName');
      expect(payload.courses[0].author).toHaveProperty('lastName');
    });
  });

  describe('Search through public courses', () => {
    let courseToSearch;

    beforeAll(async () => {
      courseToSearch = await createCourse({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareCourseFromSeed({
          seed: courseToTest,
          name: '-uniquePublicIdentifier',
        }),
      });
    });

    it('should return one course', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: `?search=${courseToSearch.course.name}`,
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
        url: '?search=nomatchstring',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('courses');
      expect(payload.total).toBe(0);
    });
  });
});
