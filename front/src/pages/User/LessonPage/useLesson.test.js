import { QueryClient, QueryClientProvider } from 'react-query';
import { act,renderHook } from '@testing-library/react-hooks';

import {
  createNextBlock,
  createParagraphBlock,
  createQuizBlock,
  createQuizResultBlock,
  createQuizResultBlockResponse,
} from '@sb-ui/pages/User/LessonPage/useLesson.test.util';
import { getLessonById, postLessonById } from '@sb-ui/utils/api/v1/student';

import { useLesson } from './useLesson';

jest.mock('react-i18next');
jest.mock('@sb-ui/utils/api/v1/student');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    id: 1,
  }),
}));

describe('Test useLesson', () => {
  let queryClient;
  let wrapper;
  beforeEach(() => {
    queryClient = new QueryClient();
    // eslint-disable-next-line react/prop-types
    wrapper = ({ children }) => (
      // eslint-disable-next-line react/jsx-filename-extension
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  describe('POST action Start', () => {
    test.each([
      [
        '3 blocks response (paragraph,paragraph, next)',
        {
          id: 1,
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
            createNextBlock(3),
          ],
        },
        {
          blocks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createParagraphBlock(2, 'Paragraph2'),
            ],
          ],
          interactiveBlock: createNextBlock(3),
          nextCount: 1,
          total: 3,
          isFinal: false,
        },
      ],
      [
        '3 blocks response (paragraph, paragraph, quiz)',
        {
          id: 1,
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
            createQuizBlock(3, [true, true]),
          ],
        },
        {
          blocks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createParagraphBlock(2, 'Paragraph2'),
            ],
          ],
          interactiveBlock: createQuizBlock(3, [true, true]),
          nextCount: 0,
          total: 3,
          isFinal: false,
        },
      ],
    ])('with %s', async (_, payload, expected) => {
      const mockedLesson = {
        authors: [{ id: 1, firstName: 'George', lastName: 'Bakman' }],
        blocks: [],
        description: '',
        id: payload.id,
        name: 'test',
        status: 'Public',
      };

      getLessonById.mockImplementation(() => ({
        isFinal: false,
        lesson: mockedLesson,
        total: expected.total,
      }));

      postLessonById.mockImplementation(() => ({
        lesson: {
          ...mockedLesson,
          blocks: payload.blocks,
        },
        isFinal: expected.isFinal,
      }));

      const { result, waitFor } = renderHook(() => useLesson(), { wrapper });
      await waitFor(() => result.current.isSuccess);
      await act(() => {
        result.current.handleStartClick();
      });

      await waitFor(() => result.current.interactiveBlock !== null);

      const {
        blocks,
        lesson,
        interactiveBlock,
        nextCount,
        total,
        isFinal,
        isLoading,
      } = result.current;

      expect(blocks).toEqual(expected.blocks);
      expect(lesson).toBe(mockedLesson);
      expect(total).toBe(expected.total);
      expect(interactiveBlock).toEqual(expected.interactiveBlock);
      expect(nextCount).toBe(expected.nextCount);
      expect(isLoading).toBe(false);
      expect(isFinal).toBe(false);
    });
  });

  describe('POST action Next', () => {
    test.each([
      [
        '3 blocks response (paragraph,paragraph, next)',
        {
          id: 1,
          beforeBlocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
            createNextBlock(3),
          ],
          newBlocks: [
            createParagraphBlock(4, 'Paragraph4'),
            createParagraphBlock(5, 'Paragraph5'),
            createNextBlock(6),
          ],
        },
        {
          blocks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createParagraphBlock(2, 'Paragraph2'),
            ],
            [
              createParagraphBlock(4, 'Paragraph4'),
              createParagraphBlock(5, 'Paragraph5'),
            ],
          ],
          interactiveBlock: createNextBlock(6),
          nextCount: 2,
          total: 8,
          isFinal: false,
        },
      ],
    ])('with %s', async (_, payload, expected) => {
      const mockedLesson = {
        authors: [{ id: 1, firstName: 'George', lastName: 'Bakman' }],
        blocks: payload.beforeBlocks,
        description: '',
        id: payload.id,
        name: 'test',
        status: 'Public',
      };

      getLessonById.mockImplementation(() => ({
        isFinal: false,
        lesson: mockedLesson,
        total: expected.total,
      }));

      postLessonById.mockImplementation(() => ({
        lesson: {
          ...mockedLesson,
          blocks: payload.newBlocks,
        },
        isFinal: expected.isFinal,
      }));

      const { result, waitFor } = renderHook(() => useLesson(), { wrapper });
      await waitFor(() => result.current.isSuccess);
      await waitFor(
        () =>
          result.current.interactiveBlock !== undefined &&
          result.current.interactiveBlock !== null,
      );
      await act(() => {
        result.current.handleNextClick();
      });

      await waitFor(() => result.current.blocks.length > 1);

      const {
        blocks,
        lesson,
        interactiveBlock,
        nextCount,
        total,
        isFinal,
        isLoading,
      } = result.current;

      expect(blocks).toEqual(expected.blocks);
      expect(lesson).toBe(mockedLesson);
      expect(total).toBe(expected.total);
      expect(interactiveBlock).toEqual(expected.interactiveBlock);
      expect(nextCount).toBe(expected.nextCount);
      expect(isLoading).toBe(false);
      expect(isFinal).toBe(false);
    });
  });

  describe('POST action Response', () => {
    test.each([
      [
        '3 blocks response (paragraph, paragraph, quiz)',
        {
          id: 1,
          results: [true, true],
          beforeBlocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
            createQuizBlock(3, [true, true]),
          ],
          newBlocks: [
            createParagraphBlock(4, 'Paragraph4'),
            createParagraphBlock(5, 'Paragraph5'),
            createNextBlock(6),
          ],
        },
        {
          blocks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createParagraphBlock(2, 'Paragraph2'),
            ],
            [createQuizResultBlockResponse(3, [true, true], [true, true])],
            [
              createParagraphBlock(4, 'Paragraph4'),
              createParagraphBlock(5, 'Paragraph5'),
            ],
          ],
          interactiveBlock: createNextBlock(6),
          nextCount: 1,
          total: 8,
          isFinal: false,
        },
      ],
    ])('with %s', async (_, payload, expected) => {
      const mockedLesson = {
        authors: [{ id: 1, firstName: 'George', lastName: 'Bakman' }],
        blocks: payload.beforeBlocks,
        description: '',
        id: payload.id,
        name: 'test',
        status: 'Public',
      };

      getLessonById.mockImplementation(() => ({
        isFinal: false,
        lesson: mockedLesson,
        total: expected.total,
      }));

      postLessonById.mockImplementation(() => ({
        lesson: {
          userAnswer: {
            response: payload.results,
          },
          answer: {
            results: payload.results,
          },
          ...mockedLesson,
          blocks: payload.newBlocks,
        },
        isFinal: expected.isFinal,
      }));

      const { result, waitFor } = renderHook(() => useLesson(), { wrapper });
      await waitFor(() => result.current.isSuccess);
      await waitFor(
        () =>
          result.current.interactiveBlock !== undefined &&
          result.current.interactiveBlock !== null,
      );
      await act(() => {
        result.current.setQuizAnswer([true, true]);
      });
      await act(() => {
        result.current.handleSendClick();
      });

      await waitFor(() => result.current.blocks.length > 1);

      const {
        blocks,
        lesson,
        interactiveBlock,
        nextCount,
        total,
        isFinal,
        isLoading,
      } = result.current;

      expect(blocks).toEqual(expected.blocks);
      expect(lesson).toBe(mockedLesson);
      expect(total).toBe(expected.total);
      expect(interactiveBlock).toEqual(expected.interactiveBlock);
      expect(nextCount).toBe(expected.nextCount);
      expect(isLoading).toBe(false);
      expect(isFinal).toBe(false);
    });
  });

  describe('GET finished lesson ', () => {
    test.each([
      [
        '0 blocks ()',
        {
          id: 1,
          blocks: [],
        },
        {
          blocks: [],
          nextCount: 0,
        },
      ],
      [
        '3 blocks (paragraph,paragraph,next)',
        {
          id: 1,
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
            createNextBlock(3),
          ],
        },
        {
          blocks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createParagraphBlock(2, 'Paragraph2'),
            ],
          ],
          nextCount: 1,
        },
      ],
      [
        '3 blocks (paragraph,quizResult,paragraph)',
        {
          id: 1,
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createQuizResultBlock(
              2,
              [false, true, true, false],
              [true, false, false, true],
            ),
            createParagraphBlock(3, 'Paragraph2'),
          ],
        },
        {
          blocks: [
            [createParagraphBlock(1, 'Paragraph1')],
            [
              createQuizResultBlockResponse(
                2,
                [false, true, true, false],
                [true, false, false, true],
              ),
            ],
            [createParagraphBlock(3, 'Paragraph2')],
          ],
          nextCount: 0,
        },
      ],
      [
        '5 blocks (paragraph,paragraph,next,paragraph,paragraph)',
        {
          id: 1,
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
            createNextBlock(3),
            createParagraphBlock(3, 'Paragraph3'),
            createParagraphBlock(4, 'Paragraph4'),
          ],
        },
        {
          blocks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createParagraphBlock(2, 'Paragraph2'),
            ],
            [
              createParagraphBlock(3, 'Paragraph3'),
              createParagraphBlock(4, 'Paragraph4'),
            ],
          ],
          nextCount: 1,
        },
      ],
      [
        '2 blocks (paragraph,paragraph)',
        {
          id: 1,
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
          ],
        },
        {
          blocks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createParagraphBlock(2, 'Paragraph2'),
            ],
          ],
          nextCount: 0,
        },
      ],
      [
        '6 blocks (paragraph,paragraph,quizResult,paragraph,quizResult,paragraph)',
        {
          id: 1,
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
            createQuizResultBlock(3, [false, true], [false, true]),
            createParagraphBlock(4, 'Paragraph3'),
            createQuizResultBlock(5, [true], [false]),
            createParagraphBlock(6, 'Paragraph4'),
          ],
        },
        {
          blocks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createParagraphBlock(2, 'Paragraph2'),
            ],
            [createQuizResultBlockResponse(3, [false, true], [false, true])],
            [createParagraphBlock(4, 'Paragraph3')],
            [createQuizResultBlockResponse(5, [true], [false])],
            [createParagraphBlock(6, 'Paragraph4')],
          ],
          nextCount: 0,
        },
      ],
      [
        '6 blocks (paragraph,paragraph,next,paragraph,next,paragraph)',
        {
          id: 1,
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
            createNextBlock(3),
            createParagraphBlock(4, 'Paragraph3'),
            createNextBlock(5),
            createParagraphBlock(6, 'Paragraph4'),
          ],
        },
        {
          blocks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createParagraphBlock(2, 'Paragraph2'),
            ],
            [createParagraphBlock(4, 'Paragraph3')],
            [createParagraphBlock(6, 'Paragraph4')],
          ],
          nextCount: 2,
        },
      ],
      [
        '3 blocks (paragraph, paragraph, quizResult)',
        {
          id: 1,
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
            createQuizResultBlock(3, [true], [true]),
          ],
        },
        {
          blocks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createParagraphBlock(2, 'Paragraph2'),
            ],
            [createQuizResultBlockResponse(3, [true], [true])],
          ],
          nextCount: 0,
        },
      ],
    ])('with %s', async (_, payload, expected) => {
      const mockedLesson = {
        authors: [{ id: 1, firstName: 'George', lastName: 'Bakman' }],
        blocks: payload.blocks,
        description: '',
        id: payload.id,
        name: 'test',
        status: 'Public',
      };

      getLessonById.mockImplementation(() => ({
        isFinal: true,
        lesson: mockedLesson,
        total: mockedLesson.blocks.length,
      }));

      const { result, waitFor } = renderHook(() => useLesson(), { wrapper });
      await waitFor(() => result.current.isSuccess);
      await waitFor(() => result.current.interactiveBlock !== undefined);

      const {
        blocks,
        lesson,
        interactiveBlock,
        nextCount,
        total,
        isFinal,
        isLoading,
      } = result.current;

      expect(blocks).toEqual(expected.blocks);
      expect(lesson).toBe(mockedLesson);
      expect(total).toBe(mockedLesson.blocks.length);
      expect(interactiveBlock).toBe(null);
      expect(nextCount).toBe(expected.nextCount);
      expect(isLoading).toBe(false);
      expect(isFinal).toBe(true);
    });
  });

  describe('GET not finished lesson', () => {
    test.each([
      [
        '0 blocks ()',
        {
          id: 1,
          blocks: [],
          total: 3,
        },
        {
          blocks: [],
          interactiveBlock: null,
          nextCount: 0,
        },
      ],
      [
        '3 blocks (paragraph,paragraph,next)',
        {
          id: 1,
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
            createNextBlock(3),
          ],
          total: 5,
        },
        {
          blocks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createParagraphBlock(2, 'Paragraph2'),
            ],
          ],
          interactiveBlock: createNextBlock(3),
          nextCount: 1,
        },
      ],
      [
        '6 blocks (paragraph,paragraph,next, paragraph, paragraph, next)',
        {
          id: 1,
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
            createNextBlock(3),
            createParagraphBlock(4, 'Paragraph4'),
            createParagraphBlock(5, 'Paragraph5'),
            createNextBlock(6),
          ],
          total: 10,
        },
        {
          blocks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createParagraphBlock(2, 'Paragraph2'),
            ],
            [
              createParagraphBlock(4, 'Paragraph4'),
              createParagraphBlock(5, 'Paragraph5'),
            ],
          ],
          interactiveBlock: createNextBlock(6),
          nextCount: 2,
        },
      ],
      [
        '6 blocks (paragraph, paragraph, quizResult, paragraph, paragraph, next)',
        {
          id: 1,
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
            createQuizResultBlock(3, [true, false], [true, false]),
            createParagraphBlock(4, 'Paragraph4'),
            createParagraphBlock(5, 'Paragraph5'),
            createNextBlock(6),
          ],
          total: 10,
        },
        {
          blocks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createParagraphBlock(2, 'Paragraph2'),
            ],
            [createQuizResultBlockResponse(3, [true, false], [true, false])],
            [
              createParagraphBlock(4, 'Paragraph4'),
              createParagraphBlock(5, 'Paragraph5'),
            ],
          ],
          interactiveBlock: createNextBlock(6),
          nextCount: 1,
        },
      ],
      [
        '3 blocks (paragraph, paragraph, quiz)',
        {
          id: 1,
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
            createQuizBlock(3, [true, false]),
          ],
          total: 10,
        },
        {
          blocks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createParagraphBlock(2, 'Paragraph2'),
            ],
          ],
          interactiveBlock: createQuizBlock(3, [true, false]),
          nextCount: 0,
        },
      ],
      [
        '6 blocks (paragraph, paragraph, next,quizResult,paragraph,next)',
        {
          id: 1,
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
            createNextBlock(3),
            createQuizResultBlock(4, [true, true], [false, true]),
            createParagraphBlock(5),
            createNextBlock(6),
          ],
          total: 10,
        },
        {
          blocks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createParagraphBlock(2, 'Paragraph2'),
            ],
            [createQuizResultBlockResponse(4, [true, true], [false, true])],
            [createParagraphBlock(5)],
          ],
          interactiveBlock: createNextBlock(6),
          nextCount: 2,
        },
      ],
      [
        '6 blocks (paragraph, paragraph, next,quizResult,paragraph,quiz)',
        {
          id: 1,
          blocks: [
            createParagraphBlock(1, 'Paragraph1'),
            createParagraphBlock(2, 'Paragraph2'),
            createNextBlock(3),
            createQuizResultBlock(4, [true, true], [false, true]),
            createParagraphBlock(5),
            createQuizBlock(6, [true, true]),
          ],
          total: 10,
        },
        {
          blocks: [
            [
              createParagraphBlock(1, 'Paragraph1'),
              createParagraphBlock(2, 'Paragraph2'),
            ],
            [createQuizResultBlockResponse(4, [true, true], [false, true])],
            [createParagraphBlock(5)],
          ],
          interactiveBlock: createQuizBlock(6, [true, true]),
          nextCount: 1,
        },
      ],
    ])('with %s', async (_, payload, expected) => {
      const mockedLesson = {
        authors: [{ id: 1, firstName: 'George', lastName: 'Bakman' }],
        blocks: payload.blocks,
        description: '',
        id: payload.id,
        name: 'test',
        status: 'Public',
      };

      getLessonById.mockImplementation(() => ({
        isFinal: false,
        lesson: mockedLesson,
        total: payload.total,
      }));

      const { result, waitFor } = renderHook(() => useLesson(), { wrapper });
      await waitFor(() => result.current.isSuccess);
      await waitFor(() => result.current.interactiveBlock !== undefined);

      const {
        blocks,
        lesson,
        interactiveBlock,
        nextCount,
        total,
        isFinal,
        isLoading,
      } = result.current;

      expect(blocks).toEqual(expected.blocks);
      expect(lesson).toBe(mockedLesson);
      expect(total).toBe(payload.total);
      expect(interactiveBlock).toEqual(expected.interactiveBlock);
      expect(nextCount).toBe(expected.nextCount);
      expect(isLoading).toBe(false);
      expect(isFinal).toBe(false);
    });
  });
});
