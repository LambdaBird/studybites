import build from '../../src/app';
import { defaultPassword, teacherMike } from '../../seeds/testData/users';
import { authorizeUser, createLesson, prepareLessonFromSeed } from './utils';
import { french } from '../../seeds/testData/lessons';
import Keyword from '../../src/models/Keyword';
import ResourceKeyword from '../../src/models/ResourceKeyword';

describe('Keywords creation and filtering', () => {
  const testContext = {
    app: null,
    token: null,
    request: async () => {},
  };

  const credentials = {
    email: teacherMike.email,
    password: defaultPassword,
  };

  beforeAll(async () => {
    testContext.app = build();

    await authorizeUser({
      credentials,
      app: testContext.app,
      setToken: (accessToken) => {
        testContext.token = accessToken;
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
  });

  afterAll(async () => {
    await testContext.app.close();
  });

  describe('Create keywords on lesson creation', () => {
    it('should successfully create keywords', async () => {
      const response = await testContext.request({
        url: 'lessons-management/lessons',
        body: {
          ...prepareLessonFromSeed(french),
          keywords: [{ name: 'French' }, { name: 'Language' }],
        },
      });

      const keywordsData = await Keyword.getAll({
        offset: 0,
        limit: 10,
      });

      testContext.keywordsData = keywordsData;

      expect(response.statusCode).toBe(200);
      expect(keywordsData.total).toBe(2);
      expect(keywordsData.results).toBeInstanceOf(Array);
    });
  });

  it('should not create new keywords', async () => {
    const response = await testContext.request({
      url: 'lessons-management/lessons',
      body: {
        ...prepareLessonFromSeed(french),
        keywords: [
          { id: 1, name: 'French' },
          { id: 2, name: 'Language' },
        ],
      },
    });

    const keywordsData = await Keyword.getAll({
      offset: 0,
      limit: 10,
    });

    expect(response.statusCode).toBe(200);
    expect(keywordsData.total).toBe(testContext.keywordsData.total);
    expect(keywordsData.results).toBeInstanceOf(Array);
    expect(keywordsData.results).toEqual(testContext.keywordsData.results);
  });

  it('should create one new keyword', async () => {
    const response = await testContext.request({
      url: 'lessons-management/lessons',
      body: {
        ...prepareLessonFromSeed(french),
        keywords: [
          { name: 'French' },
          { name: 'Language' },
          { name: 'Literature' },
        ],
      },
    });

    const keywordsData = await Keyword.getAll({
      offset: 0,
      limit: 10,
    });

    expect(response.statusCode).toBe(200);
    expect(keywordsData.total).toBe(testContext.keywordsData.total + 1);
    expect(keywordsData.results).toBeInstanceOf(Array);
    expect(keywordsData.results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Language',
        }),
      ]),
    );
  });

  describe('Update lesson keywords', () => {
    let lessonToUpdate;

    beforeAll(async () => {
      lessonToUpdate = await createLesson({
        app: testContext.app,
        credentials,
        body: prepareLessonFromSeed(french, '-lessonToUpdate'),
      });
    });

    it('should return a lesson without keywords', async () => {
      const response = await testContext.request({
        url: `lessons-management/lessons/${lessonToUpdate.lesson.id}`,
        method: 'GET',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload.keywords).toBeInstanceOf(Array);
      expect(payload.keywords).toEqual([]);
    });

    it('should add a keyword to lesson', async () => {
      const response = await testContext.request({
        url: `lessons-management/lessons/${lessonToUpdate.lesson.id}`,
        method: 'PUT',
        body: {
          keywords: [{ name: 'French' }],
        },
      });

      const keywords = await ResourceKeyword.getLessonKeywords({
        lessonId: lessonToUpdate.lesson.id,
      });

      expect(response.statusCode).toBe(200);
      expect(keywords).toBeInstanceOf(Array);
      expect(keywords).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'French',
          }),
        ]),
      );
    });
  });

  describe('Get lessons with keywords', () => {
    let lessonToSearch;

    beforeAll(async () => {
      lessonToSearch = await createLesson({
        app: testContext.app,
        credentials,
        body: {
          ...prepareLessonFromSeed(french, '-lessonToSearch'),
          keywords: [{ name: 'English' }],
        },
      });
    });

    it('should return lessons with keywords', async () => {
      const response = await testContext.request({
        url: 'lessons-management/lessons?tags[]=1',
        method: 'GET',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload.lessons).toBeInstanceOf(Array);
      expect(payload.lessons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            keywords: expect.arrayContaining([
              expect.objectContaining({
                name: 'French',
              }),
            ]),
          }),
        ]),
      );
    });

    it('should add a keyword to lesson', async () => {
      const response = await testContext.request({
        url: `lessons-management/lessons/${lessonToSearch.lesson.id}`,
        method: 'PUT',
        body: {
          keywords: [{ name: 'French' }],
        },
      });

      const keywords = await ResourceKeyword.getLessonKeywords({
        lessonId: lessonToSearch.lesson.id,
      });

      expect(response.statusCode).toBe(200);
      expect(keywords).toBeInstanceOf(Array);
      expect(keywords).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'French',
          }),
        ]),
      );
    });

    it('should return lessons with keywords', async () => {
      const response = await testContext.request({
        url: 'lessons-management/lessons?tags[]=1',
        method: 'GET',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload.lessons).toBeInstanceOf(Array);
      expect(payload.lessons).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            keywords: expect.arrayContaining([
              expect.objectContaining({
                name: 'English',
              }),
            ]),
          }),
        ]),
      );
    });
  });
});
