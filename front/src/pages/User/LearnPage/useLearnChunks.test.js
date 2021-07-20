import {
  convertBlocksToChunks,
  createChunks,
  handleAnswer,
} from '@sb-ui/pages/User/LearnPage/useLearnChunks';
import {
  createFinishBlock,
  createFinished,
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
      const { chunks, lastIndex } = convertBlocksToChunks([
        createParagraphBlock(1, 'Paragraph1'),
      ]);
      expect(chunks).toStrictEqual([]);
      expect(lastIndex).toStrictEqual(0);
    });

    test('should return empty chunks when blocks without last interactive', () => {
      const { chunks, lastIndex } = convertBlocksToChunks([]);
      expect(chunks).toStrictEqual([]);
      expect(lastIndex).toStrictEqual(0);
    });

    test('should return next chunk when blocks with one next', () => {
      const { chunks, lastIndex } = convertBlocksToChunks([
        createNextBlock(1, false),
      ]);
      expect(chunks).toStrictEqual([[createNextBlock(1, false)]]);
      expect(lastIndex).toStrictEqual(1);
    });

    test('should return paragraph and next chunk when blocks with one paragraph and next', () => {
      const { chunks, lastIndex } = convertBlocksToChunks([
        createParagraphBlock(1, 'Paragraph1'),
        createNextBlock(2, false),
      ]);
      expect(chunks).toStrictEqual([
        [createParagraphBlock(1, 'Paragraph1'), createNextBlock(2, false)],
      ]);
      expect(lastIndex).toStrictEqual(2);
    });

    test('should return paragraph and quiz chunk when blocks with one paragraph and quiz', () => {
      const { chunks, lastIndex } = convertBlocksToChunks([
        createParagraphBlock(1, 'Paragraph1'),
        createQuizBlock(2, [true, true]),
      ]);
      expect(chunks).toStrictEqual([
        [
          createParagraphBlock(1, 'Paragraph1'),
          createQuizBlock(2, [true, true]),
        ],
      ]);
      expect(lastIndex).toStrictEqual(2);
    });

    test('should return paragraph and quizResult chunk when blocks with one paragraph and quizResult', () => {
      const { chunks, lastIndex } = convertBlocksToChunks([
        createParagraphBlock(1, 'Paragraph1'),
        createQuizResultBlock(2, [true, true], [true, true]),
      ]);
      expect(chunks).toStrictEqual([
        [
          createParagraphBlock(1, 'Paragraph1'),
          createQuizResultBlock(2, [true, true], [true, true]),
        ],
      ]);
      expect(lastIndex).toStrictEqual(2);
    });

    test('should return two chunks [paragraph, next] and [paragraph,next] when blocks [paragraph,next,paragraph,next]', () => {
      const { chunks, lastIndex } = convertBlocksToChunks([
        createParagraphBlock(1, 'Paragraph1'),
        createNextBlock(2, true),
        createParagraphBlock(3, 'Paragraph2'),
        createNextBlock(4, false),
      ]);
      expect(chunks).toStrictEqual([
        [createParagraphBlock(1, 'Paragraph1'), createNextBlock(2, true)],
        [createParagraphBlock(3, 'Paragraph2'), createNextBlock(4, false)],
      ]);
      expect(lastIndex).toStrictEqual(4);
    });
  });

  describe('Test createChunks()', () => {
    test.each([
      [
        'not finished []',
        { blocks: [], isFinished: false },
        { chunks: [[createStartBlock(false)]] },
      ],
      [
        'not finished [paragraph,next]',
        {
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createNextBlock(2, false),
          ],
          isFinished: false,
        },
        {
          chunks: [
            [createParagraphBlock(1, 'Paragraph1'), createNextBlock(2, false)],
          ],
        },
      ],
      [
        'not finished [paragraph,quiz]',
        {
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createQuizBlock(2, [true, true]),
          ],
          isFinished: false,
        },
        {
          chunks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createQuizBlock(2, [true, true]),
            ],
          ],
        },
      ],
      [
        'not finished (finish button) [paragraph]',
        {
          blocks: [createParagraphBlock(1, 'Paragraph1')],
          isFinished: false,
        },
        {
          chunks: [
            [createParagraphBlock(1, 'Paragraph1'), createFinishBlock(false)],
          ],
        },
      ],
      [
        'not finished (finish button) [], last chunk',
        {
          blocks: [],
          lastChunk: [createQuizResultBlock(1, [true, true], [true, true])],
          isFinished: false,
        },
        {
          chunks: [[createFinishBlock(false)]],
        },
      ],
      [
        'not finished (finish button) [paragraph,quizResult]',
        {
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createQuizResultBlock(2, [true, true], [true, true]),
          ],
          isFinished: false,
        },
        {
          chunks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createQuizResultBlock(2, [true, true], [true, true]),
            ],
            [createFinishBlock(false)],
          ],
        },
      ],
      [
        'finished []',
        {
          blocks: [],
          isFinished: true,
        },
        {
          chunks: [[createFinished()]],
        },
      ],
      [
        'finished [paragraph,next]',
        {
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createNextBlock(2, true),
          ],
          isFinished: true,
        },
        {
          chunks: [
            [createParagraphBlock(1, 'Paragraph1'), createNextBlock(2, true)],
            [createFinished()],
          ],
        },
      ],
      [
        'finished [paragraph,quizResult]',
        {
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createQuizResultBlock(2, [true, true], [true, true]),
          ],
          isFinished: true,
        },
        {
          chunks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createQuizResultBlock(2, [true, true], [true, true]),
            ],
            [createFinished()],
          ],
        },
      ],
    ])('with blocks %s', async (_, payload, expected) => {
      const chunks = createChunks({
        blocks: payload.blocks,
        isFinished: payload.isFinished,
        lastChunk: payload.lastChunk,
      });
      expect(chunks).toStrictEqual(expected.chunks);
    });
  });

  describe('Test handleAnswer()', () => {
    test.each([
      [
        'not finished [start] add [] -> [start,finish]',
        {
          data: {
            isFinished: false,
            lesson: {
              blocks: [],
            },
          },
          prevChunks: [[createStartBlock(false)]],
        },
        { chunks: [[createStartBlock(true)], [createFinishBlock(false)]] },
      ],
      [
        'not finished [start,paragraph,next] add [paragraph,next] -> [start,paragraph,next,paragraph,next]',
        {
          data: {
            isFinished: false,
            lesson: {
              blocks: [
                createParagraphBlock(3, 'Paragraph2'),
                createNextBlock(4, false),
              ],
            },
          },
          prevChunks: [
            [
              createStartBlock(false),
              createParagraphBlock(1, 'Paragraph1'),
              createNextBlock(2, false),
            ],
          ],
        },
        {
          chunks: [
            [
              createStartBlock(false),
              createParagraphBlock(1, 'Paragraph1'),
              createNextBlock(2, true),
            ],
            [createParagraphBlock(3, 'Paragraph2'), createNextBlock(4, false)],
          ],
        },
      ],
      [
        'not finished [start,paragraph,quiz] add [paragraph,next] -> [start,paragraph,quizResult,paragraph,next]',
        {
          data: {
            isFinished: false,
            lesson: {
              answer: {
                results: [true, true],
              },
              data: {
                response: [true, true],
              },
              blocks: [
                createParagraphBlock(3, 'Paragraph2'),
                createNextBlock(4, false),
              ],
            },
          },
          prevChunks: [
            [
              createStartBlock(false),
              createParagraphBlock(1, 'Paragraph1'),
              createQuizBlock(2, [true, true]),
            ],
          ],
        },
        {
          chunks: [
            [
              createStartBlock(false),
              createParagraphBlock(1, 'Paragraph1'),
              createQuizResultNoDataBlock(2, [true, true], [true, true]),
            ],
            [createParagraphBlock(3, 'Paragraph2'), createNextBlock(4, false)],
          ],
        },
      ],
      [
        'finished [start] add [] -> [start,finished]',
        {
          data: {
            isFinished: true,
            lesson: {
              blocks: [],
            },
          },
          prevChunks: [[createStartBlock(false)]],
        },
        { chunks: [[createStartBlock(true)], [createFinished()]] },
      ],
    ])('%s', async (_, payload, expected) => {
      const chunks = handleAnswer({
        data: payload.data,
        prevChunks: payload.prevChunks,
      });
      expect(chunks).toStrictEqual(expected.chunks);
    });
  });
});
