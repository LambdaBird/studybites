import {
  convertBlocksToChunks,
  createChunksFromBlocks,
  handleAnswer,
} from '@sb-ui/pages/User/LearnPage/useLearnChunks';
import {
  createFinishBlock,
  createNextBlock,
  createParagraphBlock,
  createQuizBlock,
  createQuizResultBlock,
  createQuizResultNoDataBlock,
  createStartBlock,
} from '@sb-ui/pages/User/LearnPage/useLearnChunks.util';

describe('Test useLearnChunks', () => {
  describe('Test convertBlocksToChunks()', () => {
    test('should return empty chunks when blocks empty', () => {
      const chunks = convertBlocksToChunks([]);
      expect(chunks).toStrictEqual([]);
    });

    test('should return one chunk when blocks without last interactive', () => {
      const chunks = convertBlocksToChunks([
        createParagraphBlock(1, 'Paragraph1'),
      ]);
      expect(chunks).toStrictEqual([[createParagraphBlock(1, 'Paragraph1')]]);
    });

    test('should return next chunk when blocks with one next', () => {
      const chunks = convertBlocksToChunks([createNextBlock(1, false)]);
      expect(chunks).toStrictEqual([[createNextBlock(1, false)]]);
    });

    test('should return paragraph and next chunk when blocks with one paragraph and next', () => {
      const chunks = convertBlocksToChunks([
        createParagraphBlock(1, 'Paragraph1'),
        createNextBlock(2, false),
      ]);
      expect(chunks).toStrictEqual([
        [createParagraphBlock(1, 'Paragraph1'), createNextBlock(2, false)],
      ]);
    });

    test('should return paragraph and quiz chunk when blocks with one paragraph and quiz', () => {
      const chunks = convertBlocksToChunks([
        createParagraphBlock(1, 'Paragraph1'),
        createQuizBlock(2, [true, true]),
      ]);
      expect(chunks).toStrictEqual([
        [
          createParagraphBlock(1, 'Paragraph1'),
          createQuizBlock(2, [true, true]),
        ],
      ]);
    });

    test('should return paragraph and quizResult chunk when blocks with one paragraph and quizResult', () => {
      const chunks = convertBlocksToChunks([
        createParagraphBlock(1, 'Paragraph1'),
        createQuizResultBlock(2, [true, true], [true, true]),
      ]);
      expect(chunks).toStrictEqual([
        [
          createParagraphBlock(1, 'Paragraph1'),
          createQuizResultBlock(2, [true, true], [true, true]),
        ],
      ]);
    });

    test('should return two chunks [paragraph, next] and [paragraph,next] when blocks [paragraph,next,paragraph,next]', () => {
      const chunks = convertBlocksToChunks([
        createParagraphBlock(1, 'Paragraph1'),
        createNextBlock(2, true),
        createParagraphBlock(3, 'Paragraph2'),
        createNextBlock(4, false),
      ]);
      expect(chunks).toStrictEqual([
        [createParagraphBlock(1, 'Paragraph1'), createNextBlock(2, true)],
        [createParagraphBlock(3, 'Paragraph2'), createNextBlock(4, false)],
      ]);
    });
  });

  describe('Test createChunksFromBlocks()', () => {
    test('should return chunk with start block when blocks empty (GET request)', () => {
      const chunks = createChunksFromBlocks({
        blocks: [],
        isFinished: false,
        isPost: false,
      });
      expect(chunks).toStrictEqual([[createStartBlock(false)]]);
    });

    test('should return empty blocks when blocks empty (POST request)', () => {
      const chunks = createChunksFromBlocks({
        blocks: [],
        isFinished: false,
        isPost: true,
      });
      expect(chunks).toStrictEqual([]);
    });

    test('should return chunk with finish block when blocks without last interactive', () => {
      const chunks = createChunksFromBlocks({
        blocks: [createParagraphBlock(1, 'Paragraph1')],
        isFinished: false,
        isPost: false,
      });
      expect(chunks).toStrictEqual([
        [createParagraphBlock(1, 'Paragraph1'), createFinishBlock(false)],
      ]);
    });

    test('should return chunk with finish block when blocks with last solved interactive', () => {
      const chunks = createChunksFromBlocks({
        blocks: [
          createParagraphBlock(1, 'Paragraph1'),
          createQuizResultBlock(2, [true, true], [true, true]),
        ],
        isFinished: false,
        isPost: false,
      });
      expect(chunks).toStrictEqual([
        [
          createParagraphBlock(1, 'Paragraph1'),
          createQuizResultBlock(2, [true, true], [true, true]),
        ],
        [createFinishBlock(false)],
      ]);
    });

    test('should return chunk with blocks when blocks with last unsolved interactive', () => {
      const chunks = createChunksFromBlocks({
        blocks: [
          createParagraphBlock(1, 'Paragraph1'),
          createNextBlock(2, false),
        ],
        isFinished: false,
        isPost: false,
      });
      expect(chunks).toStrictEqual([
        [createParagraphBlock(1, 'Paragraph1'), createNextBlock(2, false)],
      ]);
    });

    test('should return chunk with finished block when any blocks with isFinished', () => {
      const chunks = createChunksFromBlocks({
        blocks: [
          createParagraphBlock(1, 'Paragraph1'),
          createQuizResultBlock(2, [true, true], [true, true]),
        ],
        isFinished: true,
        isPost: false,
      });
      expect(chunks).toStrictEqual([
        [
          createParagraphBlock(1, 'Paragraph1'),
          createQuizResultBlock(2, [true, true], [true, true]),
        ],
        [createFinishBlock(true)],
      ]);
    });

    test('should return chunk with finished block when blocks empty and isFinished', () => {
      const chunks = createChunksFromBlocks({
        blocks: [],
        isFinished: true,
        isPost: false,
      });
      expect(chunks).toStrictEqual([[createFinishBlock(true)]]);
    });
  });

  describe('Test handleAnswer()', () => {
    test('should return [start,finish] chunks with solved blocks with initial [start] and POST []', () => {
      const chunks = handleAnswer({
        data: {
          isFinished: false,
          isFinal: true,
          blocks: [],
        },
        prevChunks: [[createStartBlock(false)]],
      });
      expect(chunks).toStrictEqual([
        [createStartBlock(true)],
        [createFinishBlock(false)],
      ]);
    });

    test('should return [start,finished] chunks with solved blocks with initial [start] and POST finished []', () => {
      const chunks = handleAnswer({
        data: {
          isFinished: true,
          blocks: [],
        },
        prevChunks: [[createStartBlock(true)], [createFinishBlock(false)]],
      });
      expect(chunks).toStrictEqual([
        [createStartBlock(true)],
        [createFinishBlock(true)],
      ]);
    });

    test('should return [start,paragraph,next,paragraph,next] chunks with solved blocks with initial [start,paragraph,next] and POST [paragraph,next]', () => {
      const chunks = handleAnswer({
        data: {
          isFinished: false,
          blocks: [
            createParagraphBlock(3, 'Paragraph1'),
            createNextBlock(4, false),
          ],
        },
        prevChunks: [
          [
            createStartBlock(false),
            createParagraphBlock(1, 'Paragraph1'),
            createNextBlock(2, false),
          ],
        ],
      });
      expect(chunks).toStrictEqual([
        [
          createStartBlock(false),
          createParagraphBlock(1, 'Paragraph1'),
          createNextBlock(2, true),
        ],
        [createParagraphBlock(3, 'Paragraph1'), createNextBlock(4, false)],
      ]);
    });

    test('should return [start,paragraph,quizResult,paragraph,next] chunks with solved blocks with initial [start,paragraph,quiz] and POST [paragraph,next]', () => {
      const chunks = handleAnswer({
        data: {
          isFinished: false,
          answer: {
            results: [true, true],
          },
          userAnswer: {
            response: [true, true],
          },
          blocks: [
            createParagraphBlock(3, 'Paragraph2'),
            createNextBlock(4, false),
          ],
        },
        prevChunks: [
          [
            createStartBlock(true),
            createParagraphBlock(1, 'Paragraph1'),
            createQuizBlock(2, [true, true]),
          ],
        ],
      });
      expect(chunks).toStrictEqual([
        [
          createStartBlock(true),
          createParagraphBlock(1, 'Paragraph1'),
          createQuizResultNoDataBlock(2, [true, true], [true, true]),
        ],
        [createParagraphBlock(3, 'Paragraph2'), createNextBlock(4, false)],
      ]);
    });
  });
});
