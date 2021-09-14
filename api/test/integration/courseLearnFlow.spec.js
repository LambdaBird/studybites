/* eslint-disable no-underscore-dangle */
import {
  defaultPassword,
  studentJohn,
  teacherMike,
} from '../../seeds/testData/users';
import build from '../../src/app';
import {
  authorizeUser,
  createCourse,
  createLesson,
  prepareLessonFromSeed,
  prepareCourseFromSeed,
} from './utils';
import { math } from '../../seeds/testData/lessons';
import { courseToTest } from '../../seeds/testData/courses';
import {
  courseServiceErrors,
  userServiceErrors,
  courseServiceMessages,
} from '../../src/config';

describe('Course learning flow', () => {
  const testContext = {
    app: null,
    teacherToken: null,
    studentToken: null,
    teacherRequest: async () => {},
    enrollRequest: async () => {},
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

  describe('Enroll to lesson in non-enrolled course', () => {
    let nonEnrolledCourse;
    let lessonToEnroll;

    beforeAll(async () => {
      lessonToEnroll = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(math),
      });

      nonEnrolledCourse = await createCourse({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareCourseFromSeed({
          seed: {
            ...courseToTest,
            _lessons: [
              ...courseToTest._lessons,
              { lesson_id: lessonToEnroll.lesson.id },
            ],
          },
        }),
      });
    });

    test('should return an error', async () => {
      const response = await testContext.studentRequest({
        url: `learn/courses/${nonEnrolledCourse.course.id}/enroll`,
        body: {
          lessonId: lessonToEnroll.lesson.id,
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(401);
      expect(payload).toHaveProperty('message');
      expect(payload.message).toBe(userServiceErrors.USER_ERR_UNAUTHORIZED);
    });
  });

  describe('Enroll to lesson not in course', () => {
    let courseToEnroll;
    let lessonToEnroll;

    beforeAll(async () => {
      lessonToEnroll = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(math),
      });

      courseToEnroll = await createCourse({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareCourseFromSeed({ seed: courseToTest }),
      });

      await testContext.studentRequest({
        url: `courses/${courseToEnroll.course.id}/enroll`,
      });
    });

    test('should return an error if the lesson is not in course', async () => {
      const response = await testContext.studentRequest({
        url: `learn/courses/${courseToEnroll.course.id}/enroll`,
        body: {
          lessonId: lessonToEnroll.lesson.id,
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload).toHaveProperty('message');
      expect(payload.message).toBe(courseServiceErrors.COURSE_ERR_FAIL_ENROLL);
    });
  });

  describe('Enroll to lesson in course', () => {
    let courseToEnroll;
    let firstLessonToEnroll;
    let lastLessonToEnroll;

    beforeAll(async () => {
      firstLessonToEnroll = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(math),
      });
      lastLessonToEnroll = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(math),
      });
      courseToEnroll = await createCourse({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareCourseFromSeed({
          seed: {
            ...courseToTest,
            _lessons: [
              { lesson_id: firstLessonToEnroll.lesson.id },
              { lesson_id: lastLessonToEnroll.lesson.id },
            ],
          },
        }),
      });

      await testContext.studentRequest({
        url: `courses/${courseToEnroll.course.id}/enroll`,
      });
    });

    test('should return an error if previous lessons are not finished', async () => {
      const response = await testContext.studentRequest({
        url: `learn/courses/${courseToEnroll.course.id}/enroll`,
        body: {
          lessonId: lastLessonToEnroll.lesson.id,
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload).toHaveProperty('message');
      expect(payload.message).toBe(courseServiceErrors.COURSE_ERR_FAIL_ENROLL);
    });

    test('should return no error if enroll to the first lesson in the course', async () => {
      const response = await testContext.studentRequest({
        url: `learn/courses/${courseToEnroll.course.id}/enroll`,
        body: {
          lessonId: firstLessonToEnroll.lesson.id,
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('message');
      expect(payload.message).toBe(
        courseServiceMessages.COURSE_MSG_SUCCESS_ENROLL,
      );
    });
  });

  describe('Enroll to the next lesson', () => {
    let courseToEnroll;
    let firstLessonToEnroll;
    let lastLessonToEnroll;

    beforeAll(async () => {
      firstLessonToEnroll = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: {
          lesson: { name: 'First one', status: 'Public' },
        },
      });
      lastLessonToEnroll = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: {
          lesson: {
            name: 'Last one',
            status: 'Public',
          },
        },
      });
      courseToEnroll = await createCourse({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareCourseFromSeed({
          seed: {
            ...courseToTest,
            _lessons: [
              { lesson_id: firstLessonToEnroll.lesson.id },
              { lesson_id: lastLessonToEnroll.lesson.id },
            ],
          },
        }),
      });

      await testContext.studentRequest({
        url: `courses/${courseToEnroll.course.id}/enroll`,
      });
      await testContext.studentRequest({
        url: `learn/courses/${courseToEnroll.course.id}/enroll`,
        body: {
          lessonId: firstLessonToEnroll.lesson.id,
        },
      });
      await testContext.studentRequest({
        url: `learn/lessons/${firstLessonToEnroll.lesson.id}/reply`,
        body: {
          action: 'start',
        },
      });
      await testContext.studentRequest({
        url: `learn/lessons/${firstLessonToEnroll.lesson.id}/reply`,
        body: {
          action: 'finish',
        },
      });
    });

    test('should return no error if previous lesson in the course is finished', async () => {
      const response = await testContext.studentRequest({
        url: `learn/courses/${courseToEnroll.course.id}/enroll`,
        body: {
          lessonId: lastLessonToEnroll.lesson.id,
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('message');
      expect(payload.message).toBe(
        courseServiceMessages.COURSE_MSG_SUCCESS_ENROLL,
      );
    });
  });

  describe('Get courses', () => {
    let courseToEnroll;
    let courseLesson;

    beforeAll(async () => {
      courseLesson = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: {
          lesson: { name: 'First one', status: 'Public' },
        },
      });
      courseToEnroll = await createCourse({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareCourseFromSeed({
          seed: {
            ...courseToTest,
            _lessons: [{ lesson_id: courseLesson.lesson.id }],
          },
        }),
      });

      await testContext.studentRequest({
        url: `courses/${courseToEnroll.course.id}/enroll`,
      });
      await testContext.studentRequest({
        url: `learn/courses/${courseToEnroll.course.id}/enroll`,
        body: {
          lessonId: courseLesson.lesson.id,
        },
      });
      await testContext.studentRequest({
        url: `learn/lessons/${courseLesson.lesson.id}/reply`,
        body: {
          action: 'start',
        },
      });
      await testContext.studentRequest({
        url: `learn/lessons/${courseLesson.lesson.id}/reply`,
        body: {
          action: 'finish',
        },
      });
    });

    test('should return all finished courses', async () => {
      const response = await testContext.studentRequest({
        url: 'learn/courses?progress=finished',
        method: 'GET',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('courses');
      expect(payload).toHaveProperty('total');
      expect(payload.total).toBe(1);
      expect(payload.courses.length).toBe(payload.total);
    });

    test('should return all ongoing courses', async () => {
      const response = await testContext.studentRequest({
        url: 'learn/courses',
        method: 'GET',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('courses');
      expect(payload).toHaveProperty('total');
      expect(payload.total).toBeGreaterThanOrEqual(1);
      expect(payload.courses.length).toBe(payload.total);
    });
  });

  describe('Get course with one lesson', () => {
    describe('when lesson is not finished', () => {
      let courseToGet;
      let courseLesson;

      beforeAll(async () => {
        courseLesson = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: {
            lesson: {
              name: 'Course lesson',
              status: 'Public',
            },
          },
        });
        courseToGet = await createCourse({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareCourseFromSeed({
            seed: {
              ...courseToGet,
              _lessons: [{ lesson_id: courseLesson.lesson.id }],
            },
          }),
        });

        await testContext.studentRequest({
          url: `courses/${courseToGet.course.id}/enroll`,
        });
        await testContext.studentRequest({
          url: `learn/courses/${courseToGet.course.id}/enroll`,
          body: {
            lessonId: courseLesson.lesson.id,
          },
        });
      });

      test('should return a course with one lesson', async () => {
        const response = await testContext.studentRequest({
          method: 'GET',
          url: `learn/courses/${courseToGet.course.id}`,
        });

        const payload = JSON.parse(response.payload);

        expect(response.statusCode).toBe(200);
        expect(payload).toHaveProperty('course');
        expect(payload.course).toHaveProperty('lessons');
        expect(payload.course.lessons).toBeInstanceOf(Array);
        expect(payload.course.lessons.length).toBe(1);
        expect(payload.course.lessons[0]).toHaveProperty('isFinished');
        expect(payload.course.lessons[0].isFinished).toBe(false);
      });
    });

    describe('when lesson is finished', () => {
      let courseToGet;
      let courseLesson;

      beforeAll(async () => {
        courseLesson = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: {
            lesson: {
              name: 'Course lesson',
              status: 'Public',
            },
          },
        });
        courseToGet = await createCourse({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareCourseFromSeed({
            seed: {
              ...courseToGet,
              _lessons: [{ lesson_id: courseLesson.lesson.id }],
            },
          }),
        });

        await testContext.studentRequest({
          url: `courses/${courseToGet.course.id}/enroll`,
        });
        await testContext.studentRequest({
          url: `learn/courses/${courseToGet.course.id}/enroll`,
          body: {
            lessonId: courseLesson.lesson.id,
          },
        });
        await testContext.studentRequest({
          url: `learn/lessons/${courseLesson.lesson.id}/reply`,
          body: {
            action: 'start',
          },
        });
        await testContext.studentRequest({
          url: `learn/lessons/${courseLesson.lesson.id}/reply`,
          body: {
            action: 'finish',
          },
        });
      });

      test('should return a course with one lesson', async () => {
        const response = await testContext.studentRequest({
          method: 'GET',
          url: `learn/courses/${courseToGet.course.id}`,
        });

        const payload = JSON.parse(response.payload);

        expect(response.statusCode).toBe(200);
        expect(payload).toHaveProperty('course');
        expect(payload.course).toHaveProperty('lessons');
        expect(payload.course.lessons).toBeInstanceOf(Array);
        expect(payload.course.lessons.length).toBe(1);
        expect(payload.course.lessons[0]).toHaveProperty('isFinished');
        expect(payload.course.lessons[0].isFinished).toBe(true);
      });
    });
  });

  describe('Get course with multiple lessons', () => {
    describe('when the first lesson was not finished yet', () => {
      let courseToGet;
      let firstLesson;
      let secondLesson;
      let thirdLesson;

      beforeAll(async () => {
        firstLesson = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: {
            lesson: {
              name: 'Course lesson',
              status: 'Public',
            },
          },
        });
        secondLesson = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: {
            lesson: {
              name: 'Course lesson',
              status: 'Public',
            },
          },
        });
        thirdLesson = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: {
            lesson: {
              name: 'Course lesson',
              status: 'Public',
            },
          },
        });
        courseToGet = await createCourse({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareCourseFromSeed({
            seed: {
              ...courseToGet,
              _lessons: [
                { lesson_id: firstLesson.lesson.id },
                { lesson_id: secondLesson.lesson.id },
                { lesson_id: thirdLesson.lesson.id },
              ],
            },
          }),
        });

        await testContext.studentRequest({
          url: `courses/${courseToGet.course.id}/enroll`,
        });
        await testContext.studentRequest({
          url: `learn/courses/${courseToGet.course.id}/enroll`,
          body: {
            lessonId: firstLesson.lesson.id,
          },
        });
        await testContext.studentRequest({
          url: `learn/lessons/${firstLesson.lesson.id}/reply`,
          body: {
            action: 'start',
          },
        });
      });

      test('should return a course with one unfinished lesson', async () => {
        const response = await testContext.studentRequest({
          method: 'GET',
          url: `learn/courses/${courseToGet.course.id}`,
        });

        const payload = JSON.parse(response.payload);

        expect(response.statusCode).toBe(200);
        expect(payload).toHaveProperty('course');
        expect(payload.course).toHaveProperty('lessons');
        expect(payload.course.lessons).toBeInstanceOf(Array);
        expect(payload.course.lessons.length).toBe(3);
        expect(payload.course.lessons[0]).toHaveProperty('isFinished');
        expect(payload.course.lessons[0].isFinished).toBe(false);
      });
    });

    describe('when the first lesson was finished already', () => {
      let courseToGet;
      let firstLesson;
      let secondLesson;
      let thirdLesson;

      beforeAll(async () => {
        firstLesson = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: {
            lesson: {
              name: 'Course lesson',
              status: 'Public',
            },
          },
        });
        secondLesson = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: {
            lesson: {
              name: 'Course lesson',
              status: 'Public',
            },
          },
        });
        thirdLesson = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: {
            lesson: {
              name: 'Course lesson',
              status: 'Public',
            },
          },
        });
        courseToGet = await createCourse({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareCourseFromSeed({
            seed: {
              ...courseToGet,
              _lessons: [
                { lesson_id: firstLesson.lesson.id },
                { lesson_id: secondLesson.lesson.id },
                { lesson_id: thirdLesson.lesson.id },
              ],
            },
          }),
        });

        await testContext.studentRequest({
          url: `courses/${courseToGet.course.id}/enroll`,
        });
        await testContext.studentRequest({
          url: `learn/courses/${courseToGet.course.id}/enroll`,
          body: {
            lessonId: firstLesson.lesson.id,
          },
        });
        await testContext.studentRequest({
          url: `learn/lessons/${firstLesson.lesson.id}/reply`,
          body: {
            action: 'start',
          },
        });
        await testContext.studentRequest({
          url: `learn/lessons/${firstLesson.lesson.id}/reply`,
          body: {
            action: 'finish',
          },
        });
      });

      test('should return a course with one finished and one unfinished lesson', async () => {
        const response = await testContext.studentRequest({
          method: 'GET',
          url: `learn/courses/${courseToGet.course.id}`,
        });

        const payload = JSON.parse(response.payload);

        expect(response.statusCode).toBe(200);
        expect(payload).toHaveProperty('course');
        expect(payload.course).toHaveProperty('lessons');
        expect(payload.course.lessons).toBeInstanceOf(Array);
        expect(payload.course.lessons.length).toBe(3);
        expect(payload.course.lessons[0]).toHaveProperty('isFinished');
        expect(payload.course.lessons[0].isFinished).toBe(true);
        expect(payload.course.lessons[1]).toHaveProperty('isFinished');
        expect(payload.course.lessons[1].isFinished).toBe(false);
      });
    });

    describe('when one of the lessons was finished off-course', () => {
      let courseToGet;
      let firstLesson;
      let secondLesson;
      let thirdLesson;

      beforeAll(async () => {
        firstLesson = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: {
            lesson: {
              name: 'Course lesson',
              status: 'Public',
            },
          },
        });
        secondLesson = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: {
            lesson: {
              name: 'Course lesson',
              status: 'Public',
            },
          },
        });
        thirdLesson = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: {
            lesson: {
              name: 'Course lesson',
              status: 'Public',
            },
          },
        });
        courseToGet = await createCourse({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareCourseFromSeed({
            seed: {
              ...courseToGet,
              _lessons: [
                { lesson_id: firstLesson.lesson.id },
                { lesson_id: secondLesson.lesson.id },
                { lesson_id: thirdLesson.lesson.id },
              ],
            },
          }),
        });

        await testContext.studentRequest({
          url: `courses/${courseToGet.course.id}/enroll`,
        });
        await testContext.studentRequest({
          url: `learn/courses/${courseToGet.course.id}/enroll`,
          body: {
            lessonId: firstLesson.lesson.id,
          },
        });
        await testContext.studentRequest({
          url: `learn/lessons/${firstLesson.lesson.id}/reply`,
          body: {
            action: 'start',
          },
        });
        await testContext.studentRequest({
          url: `lessons/${secondLesson.lesson.id}/reply`,
          body: {
            action: 'start',
          },
        });
        await testContext.studentRequest({
          url: `lessons/${secondLesson.lesson.id}/reply`,
          body: {
            action: 'finish',
          },
        });
      });

      test('should return a course with one unfinished lesson', async () => {
        const response = await testContext.studentRequest({
          method: 'GET',
          url: `learn/courses/${courseToGet.course.id}`,
        });

        const payload = JSON.parse(response.payload);

        expect(response.statusCode).toBe(200);
        expect(payload).toHaveProperty('course');
        expect(payload.course).toHaveProperty('lessons');
        expect(payload.course.lessons).toBeInstanceOf(Array);
        expect(payload.course.lessons.length).toBe(3);
        expect(payload.course.lessons[0]).toHaveProperty('isFinished');
        expect(payload.course.lessons[0].isFinished).toBe(false);
        expect(payload.course.lessons[0].lessonId).toBe(firstLesson.lesson.id);
      });
    });
  });
});
