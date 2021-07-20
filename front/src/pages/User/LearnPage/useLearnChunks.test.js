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
    test.each([
      ['[]', { blocks: [] }, { chunks: [], lastIndex: 0 }],
      [
        '[paragraph]',
        { blocks: [createParagraphBlock(1, 'Paragraph1')] },
        { chunks: [], lastIndex: 0 },
      ],
      [
        '[next]',
        { blocks: [createNextBlock(1, false)] },
        { chunks: [[createNextBlock(1, false)]], lastIndex: 1 },
      ],
      [
        '[paragraph,next]',
        {
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createNextBlock(2, false),
          ],
        },
        {
          chunks: [
            [createParagraphBlock(1, 'Paragraph1'), createNextBlock(2, false)],
          ],
          lastIndex: 2,
        },
      ],
      [
        '[paragraph,quiz]',
        {
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createQuizBlock(2, [true, true]),
          ],
        },
        {
          chunks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createQuizBlock(2, [true, true]),
            ],
          ],
          lastIndex: 2,
        },
      ],
      [
        '[paragraph,quizResult]',
        {
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createQuizResultBlock(2, [true, true], [true, true]),
          ],
        },
        {
          chunks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createQuizResultBlock(2, [true, true], [true, true]),
            ],
          ],
          lastIndex: 2,
        },
      ],
      [
        '[paragraph,next,paragraph,next]',
        {
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createNextBlock(2, true),
            createParagraphBlock(3, 'Paragraph2'),
            createNextBlock(4, false),
          ],
        },
        {
          chunks: [
            [createParagraphBlock(1, 'Paragraph1'), createNextBlock(2, true)],
            [createParagraphBlock(3, 'Paragraph2'), createNextBlock(4, false)],
          ],
          lastIndex: 4,
        },
      ],
    ])('with blocks %s', async (_, payload, expected) => {
      const { chunks, lastIndex } = convertBlocksToChunks(payload.blocks);
      expect(chunks).toStrictEqual(expected.chunks);
      expect(lastIndex).toStrictEqual(expected.lastIndex);
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
