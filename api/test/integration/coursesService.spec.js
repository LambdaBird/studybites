import build from '../../src/app';

import { courseToTest } from '../../seeds/testData/courses';
import {
  teacherMike,
  studentJohn,
  defaultPassword,
} from '../../seeds/testData/users';

import { authorizeUser, createCourse, prepareCourseFromSeed } from './utils';
import {
  courseServiceErrors as errors,
  courseServiceMessages as messages,
} from '../../src/config';

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

  describe('Enroll to public', () => {
    let publicCourse;

    beforeAll(async () => {
      publicCourse = await createCourse({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareCourseFromSeed(courseToTest, '-publicCourse'),
      });
    });

    it('should successfully enroll', async () => {
      const response = await testContext.request({
        url: `${publicCourse.course.id}/enroll`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload.message).toBe(messages.COURSE_MSG_SUCCESS_ENROLL);
    });
  });

  describe('Enroll multiple times', () => {
    let courseToEnroll;

    beforeAll(async () => {
      courseToEnroll = await createCourse({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareCourseFromSeed(courseToTest, '-courseToEnroll'),
      });

      await testContext.request({
        url: `${courseToEnroll.course.id}/enroll`,
      });
    });

    it('should return an error if try to enroll multiple times', async () => {
      const response = await testContext.request({
        url: `${courseToEnroll.course.id}/enroll`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.COURSE_ERR_FAIL_ENROLL);
    });
  });

  describe('Enroll to not public', () => {
    let draftCourse;
    let archivedCourse;
    let privateCourse;

    beforeAll(async () => {
      draftCourse = await createCourse({
        app: testContext.app,
        credentials: teacherCredentials,
        body: {
          course: {
            name: 'Draft',
            status: 'Draft',
          },
        },
      });

      archivedCourse = await createCourse({
        app: testContext.app,
        credentials: teacherCredentials,
        body: {
          course: {
            name: 'Archived',
            status: 'Archived',
          },
        },
      });

      privateCourse = await createCourse({
        app: testContext.app,
        credentials: teacherCredentials,
        body: {
          course: {
            name: 'Private',
            status: 'Private',
          },
        },
      });
    });

    it('should return an error if try to enroll to draft', async () => {
      const response = await testContext.request({
        url: `${draftCourse.course.id}/enroll`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.COURSE_ERR_FAIL_ENROLL);
    });

    it('should return an error if try to enroll to archived', async () => {
      const response = await testContext.request({
        url: `${archivedCourse.course.id}/enroll`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.COURSE_ERR_FAIL_ENROLL);
    });

    it('should return an error if try to enroll to private', async () => {
      const response = await testContext.request({
        url: `${privateCourse.course.id}/enroll`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.COURSE_ERR_FAIL_ENROLL);
    });
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
        body: prepareCourseFromSeed(courseToTest, '-uniquePublicIdentifier'),
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
