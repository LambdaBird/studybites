import { checkAllowed } from '../../src/services/lesson/handlers/learnLesson';

describe('checkAllowed returns allowed action based on the last Results record', () => {
  const Result = jest.fn();
  const LessonBlockStructure = jest.fn();

  describe('when lesson is not started', () => {
    beforeAll(() => {
      Result.getLastResult = jest.fn(() => {
        return undefined;
      });
      LessonBlockStructure.getChunk = jest.fn(() => {
        return { total: 0, chunk: [] };
      });
    });

    test('should return "start"', async () => {
      const { allowed } = await checkAllowed({
        userId: 1,
        lessonId: 1,
        Result,
        LessonBlockStructure,
      });

      expect(allowed).toHaveProperty('action');
      expect(allowed.action).toBe('start');
    });
  });

  describe('when lesson is finished', () => {
    beforeAll(() => {
      Result.getLastResult = jest.fn(() => {
        return {
          action: 'finish',
        };
      });
      LessonBlockStructure.getChunk = jest.fn(() => {
        return { total: 0, chunk: [] };
      });
    });

    test('should return "null"', async () => {
      const { allowed } = await checkAllowed({
        userId: 1,
        lessonId: 1,
        Result,
        LessonBlockStructure,
      });

      expect(allowed).toBe(null);
    });
  });

  describe('when lesson has an interactive block', () => {
    describe('before the "quiz" block', () => {
      beforeAll(() => {
        Result.getLastResult = jest.fn(() => {
          return {
            action: 'start',
          };
        });
        LessonBlockStructure.getChunk = jest.fn(() => {
          return {
            total: 1,
            chunk: [
              {
                type: 'quiz',
              },
            ],
          };
        });
      });

      test('should return "response"', async () => {
        const { allowed } = await checkAllowed({
          userId: 1,
          lessonId: 1,
          Result,
          LessonBlockStructure,
        });

        expect(allowed).toHaveProperty('action');
        expect(allowed.action).toBe('response');
      });
    });

    describe('after the "quiz" block', () => {
      beforeAll(() => {
        Result.getLastResult = jest.fn(() => {
          return {
            action: 'response',
          };
        });
        LessonBlockStructure.getChunk = jest.fn(() => {
          return { total: 0, chunk: [] };
        });
      });

      test('should return "finish"', async () => {
        const { allowed } = await checkAllowed({
          userId: 1,
          lessonId: 1,
          Result,
          LessonBlockStructure,
        });

        expect(allowed).toHaveProperty('action');
        expect(allowed.action).toBe('finish');
      });
    });
  });

  describe('when lesson has a non-interactive block', () => {
    beforeAll(() => {
      Result.getLastResult = jest.fn(() => {
        return {
          action: 'start',
        };
      });
      LessonBlockStructure.getChunk = jest.fn(() => {
        return {
          total: 1,
          chunk: [
            {
              type: 'paragraph',
            },
          ],
        };
      });
    });

    test('should return "finish"', async () => {
      const { allowed } = await checkAllowed({
        userId: 1,
        lessonId: 1,
        Result,
        LessonBlockStructure,
      });

      expect(allowed).toHaveProperty('action');
      expect(allowed.action).toBe('finish');
    });
  });
});
