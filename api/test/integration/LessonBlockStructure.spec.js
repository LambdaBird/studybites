/* eslint-disable no-underscore-dangle */
import build from '../../src/app';
import LessonBlockStructure from '../../src/models/LessonBlockStructure';

import {
  teacherMike,
  defaultPassword,
  studentJohn,
} from '../../seeds/testData/users';
import { french, math, russian } from '../../seeds/testData/lessons';

import { authorizeUser, createLesson, prepareLessonFromSeed } from './utils';

describe('LessonBlockStructure methods', () => {
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
        url: `/api/v1/lesson/${url}`,
        headers: {
          authorization: `Bearer ${testContext.teacherToken}`,
        },
        body,
      });
    };
    testContext.studentRequest = async ({ url, method = 'POST', body }) => {
      return testContext.app.inject({
        method,
        url: `/api/v1/lesson/${url}`,
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

  describe('getAllBlocks method - get all blocks in the right order', () => {
    describe('multiple blocks', () => {
      let lessonWithBlocks;

      beforeAll(async () => {
        lessonWithBlocks = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareLessonFromSeed(french),
        });
      });

      it('should return an array', async () => {
        const blocks = await LessonBlockStructure.getAllBlocks({
          lessonId: lessonWithBlocks.lesson.id,
        });

        expect(blocks).toBeInstanceOf(Array);
      });

      it('should return an array of blocks in the right order', async () => {
        const blocks = await LessonBlockStructure.getAllBlocks({
          lessonId: lessonWithBlocks.lesson.id,
        });

        expect(blocks).toHaveLength(french._blocks._current.length);
        blocks.forEach((block, index) => {
          expect(block.blockId).toBe(french._blocks._current[index].block_id);
        });
      });
    });

    describe('one block (interactive)', () => {
      let lessonWithBlocks;

      beforeAll(async () => {
        lessonWithBlocks = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareLessonFromSeed(math),
        });
      });

      it('should return an array', async () => {
        const blocks = await LessonBlockStructure.getAllBlocks({
          lessonId: lessonWithBlocks.lesson.id,
        });

        expect(blocks).toBeInstanceOf(Array);
      });

      it('should return an array of blocks in the right order', async () => {
        const blocks = await LessonBlockStructure.getAllBlocks({
          lessonId: lessonWithBlocks.lesson.id,
        });

        expect(blocks).toHaveLength(math._blocks._current.length);
        blocks.forEach((block, index) => {
          expect(block.blockId).toBe(math._blocks._current[index].block_id);
        });
      });
    });

    describe('one block (non-interactive)', () => {
      let lessonWithBlocks;

      beforeAll(async () => {
        lessonWithBlocks = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareLessonFromSeed(russian),
        });
      });

      it('should return an array', async () => {
        const blocks = await LessonBlockStructure.getAllBlocks({
          lessonId: lessonWithBlocks.lesson.id,
        });

        expect(blocks).toBeInstanceOf(Array);
      });

      it('should return an array of blocks in the right order', async () => {
        const blocks = await LessonBlockStructure.getAllBlocks({
          lessonId: lessonWithBlocks.lesson.id,
        });

        expect(blocks).toHaveLength(russian._blocks._current.length);
        blocks.forEach((block, index) => {
          expect(block.blockId).toBe(russian._blocks._current[index].block_id);
        });
      });
    });

    describe('no blocks', () => {
      let lessonWithoutBlocks;

      beforeAll(async () => {
        lessonWithoutBlocks = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: {
            lesson: {
              name: 'Lesson Without Blocks',
            },
          },
        });
      });

      it('should return an array', async () => {
        const blocks = await LessonBlockStructure.getAllBlocks({
          lessonId: lessonWithoutBlocks.lesson.id,
        });

        expect(blocks).toBeInstanceOf(Array);
      });

      it('should return an empty array', async () => {
        const blocks = await LessonBlockStructure.getAllBlocks({
          lessonId: lessonWithoutBlocks.lesson.id,
        });

        expect(blocks).toHaveLength(0);
      });
    });

    describe('no such lessonId', () => {
      it('should return an array', async () => {
        const blocks = await LessonBlockStructure.getAllBlocks({
          lessonId: 1000000,
        });

        expect(blocks).toBeInstanceOf(Array);
      });

      it('should return an empty array', async () => {
        const blocks = await LessonBlockStructure.getAllBlocks({
          lessonId: 1000000,
        });

        expect(blocks).toHaveLength(0);
      });
    });
  });

  describe('getChunk method - get a chunk of blocks', () => {
    describe('multiple blocks', () => {
      describe('start', () => {
        let lessonWithBlocks;

        beforeAll(async () => {
          lessonWithBlocks = await createLesson({
            app: testContext.app,
            credentials: teacherCredentials,
            body: prepareLessonFromSeed(french),
          });

          await testContext.studentRequest({
            url: `lesson/enroll/${lessonWithBlocks.lesson.id}`,
          });

          await testContext.studentRequest({
            url: `lesson/${lessonWithBlocks.lesson.id}/learn`,
            body: {
              action: 'start',
            },
          });
        });

        it('should return an array', async () => {
          const blocks = await LessonBlockStructure.getChunk({
            lessonId: lessonWithBlocks.lesson.id,
          });

          expect(blocks).toBeInstanceOf(Array);
        });

        it('should return a chunk of blocks in the right order', async () => {
          const blocks = await LessonBlockStructure.getChunk({
            lessonId: lessonWithBlocks.lesson.id,
          });

          expect(blocks).toHaveLength(
            french._blocks._indexesOfInteractive[0] + 1,
          );
          blocks.forEach((block, index) => {
            expect(block.blockId).toBe(french._blocks._current[index].block_id);
          });
        });
      });

      describe('response', () => {
        let lessonWithBlocks;

        beforeAll(async () => {
          lessonWithBlocks = await createLesson({
            app: testContext.app,
            credentials: teacherCredentials,
            body: prepareLessonFromSeed(french),
          });

          await testContext.studentRequest({
            url: `lesson/enroll/${lessonWithBlocks.lesson.id}`,
          });

          await testContext.studentRequest({
            url: `lesson/${lessonWithBlocks.lesson.id}/learn`,
            body: {
              action: 'start',
            },
          });

          await testContext.studentRequest({
            url: `lesson/${lessonWithBlocks.lesson.id}/learn`,
            body: {
              action: 'next',
              blockId:
                french._blocks._current[french._blocks._indexesOfInteractive[0]]
                  .block_id,
              revision:
                lessonWithBlocks.lesson.blocks[
                  french._blocks._indexesOfInteractive[0]
                ].revision,
            },
          });
        });

        it('should return an array', async () => {
          const blocks = await LessonBlockStructure.getChunk({
            lessonId: lessonWithBlocks.lesson.id,
            previousBlock:
              french._blocks._current[french._blocks._indexesOfInteractive[0]]
                .block_id,
          });

          expect(blocks).toBeInstanceOf(Array);
        });

        it('should return a chunk of blocks in the right order', async () => {
          const blocks = await LessonBlockStructure.getChunk({
            lessonId: lessonWithBlocks.lesson.id,
            previousBlock:
              french._blocks._current[french._blocks._indexesOfInteractive[0]]
                .block_id,
          });

          expect(blocks).toHaveLength(
            french._blocks._indexesOfInteractive[1] -
              french._blocks._indexesOfInteractive[0],
          );
          blocks.forEach((block, index) => {
            expect(block.blockId).toBe(
              french._blocks._current[
                index + french._blocks._indexesOfInteractive[0] + 1
              ].block_id,
            );
          });
        });
      });

      describe('finish', () => {
        let lessonWithBlocks;

        beforeAll(async () => {
          lessonWithBlocks = await createLesson({
            app: testContext.app,
            credentials: teacherCredentials,
            body: prepareLessonFromSeed(french),
          });

          await testContext.studentRequest({
            url: `lesson/enroll/${lessonWithBlocks.lesson.id}`,
          });

          await testContext.studentRequest({
            url: `lesson/${lessonWithBlocks.lesson.id}/learn`,
            body: {
              action: 'start',
            },
          });

          await testContext.studentRequest({
            url: `lesson/${lessonWithBlocks.lesson.id}/learn`,
            body: {
              action: 'next',
              blockId:
                french._blocks._current[french._blocks._indexesOfInteractive[0]]
                  .block_id,
              revision:
                lessonWithBlocks.lesson.blocks[
                  french._blocks._indexesOfInteractive[0]
                ].revision,
            },
          });

          await testContext.studentRequest({
            url: `lesson/${lessonWithBlocks.lesson.id}/learn`,
            body: {
              action: 'response',
              blockId:
                french._blocks._current[french._blocks._indexesOfInteractive[1]]
                  .block_id,
              revision:
                lessonWithBlocks.lesson.blocks[
                  french._blocks._indexesOfInteractive[1]
                ].revision,
              data: {
                answers: ['my answer'],
              },
            },
          });
        });

        it('should return an array', async () => {
          const blocks = await LessonBlockStructure.getChunk({
            lessonId: lessonWithBlocks.lesson.id,
            previousBlock:
              french._blocks._current[french._blocks._indexesOfInteractive[1]]
                .block_id,
          });

          expect(blocks).toBeInstanceOf(Array);
        });

        it('should return a chunk of blocks in the right order', async () => {
          const blocks = await LessonBlockStructure.getChunk({
            lessonId: lessonWithBlocks.lesson.id,
            previousBlock:
              french._blocks._current[french._blocks._indexesOfInteractive[1]]
                .block_id,
          });

          expect(blocks).toHaveLength(1);
          blocks.forEach((block, index) => {
            expect(block.blockId).toBe(
              french._blocks._current[
                index + french._blocks._indexesOfInteractive[1] + 1
              ].block_id,
            );
          });
        });
      });
    });

    describe('one block (interactive)', () => {
      let lessonWithInteractive;

      beforeAll(async () => {
        lessonWithInteractive = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareLessonFromSeed(math),
        });

        await testContext.studentRequest({
          url: `lesson/enroll/${lessonWithInteractive.lesson.id}`,
        });

        await testContext.studentRequest({
          url: `lesson/${lessonWithInteractive.lesson.id}/learn`,
          body: {
            action: 'start',
          },
        });
      });

      it('should return an array', async () => {
        const blocks = await LessonBlockStructure.getChunk({
          lessonId: lessonWithInteractive.lesson.id,
        });

        expect(blocks).toBeInstanceOf(Array);
      });

      it('should return a chunk of blocks in the right order', async () => {
        const blocks = await LessonBlockStructure.getChunk({
          lessonId: lessonWithInteractive.lesson.id,
        });

        expect(blocks).toHaveLength(math._blocks._indexesOfInteractive[0] + 1);
        blocks.forEach((block, index) => {
          expect(block.blockId).toBe(math._blocks._current[index].block_id);
        });
      });
    });

    describe('one block (non-interactive)', () => {
      let lessonWithNonInteractive;

      beforeAll(async () => {
        lessonWithNonInteractive = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareLessonFromSeed(russian),
        });

        await testContext.studentRequest({
          url: `lesson/enroll/${lessonWithNonInteractive.lesson.id}`,
        });

        await testContext.studentRequest({
          url: `lesson/${lessonWithNonInteractive.lesson.id}/learn`,
          body: {
            action: 'start',
          },
        });
      });

      it('should return an array', async () => {
        const blocks = await LessonBlockStructure.getChunk({
          lessonId: lessonWithNonInteractive.lesson.id,
        });

        expect(blocks).toBeInstanceOf(Array);
      });

      it('should return a chunk of blocks in the right order', async () => {
        const blocks = await LessonBlockStructure.getChunk({
          lessonId: lessonWithNonInteractive.lesson.id,
        });

        expect(blocks).toHaveLength(1);
        blocks.forEach((block, index) => {
          expect(block.blockId).toBe(russian._blocks._current[index].block_id);
        });
      });
    });

    describe('no blocks', () => {
      let lessonWithoutBlocks;

      beforeAll(async () => {
        lessonWithoutBlocks = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: {
            lesson: {
              name: 'Lesson Without Blocks',
            },
          },
        });
      });

      it('should return an array', async () => {
        const blocks = await LessonBlockStructure.getAllBlocks({
          lessonId: lessonWithoutBlocks.lesson.id,
        });

        expect(blocks).toBeInstanceOf(Array);
      });

      it('should return an empty array', async () => {
        const blocks = await LessonBlockStructure.getAllBlocks({
          lessonId: lessonWithoutBlocks.lesson.id,
        });

        expect(blocks).toHaveLength(0);
      });
    });

    describe('no such lessonId', () => {
      it('should return an array', async () => {
        const blocks = await LessonBlockStructure.getAllBlocks({
          lessonId: 1000000,
        });

        expect(blocks).toBeInstanceOf(Array);
      });

      it('should return an empty array', async () => {
        const blocks = await LessonBlockStructure.getAllBlocks({
          lessonId: 1000000,
        });

        expect(blocks).toHaveLength(0);
      });
    });
  });
});
