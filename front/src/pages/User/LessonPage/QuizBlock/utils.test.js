import { verifyAnswers } from '@sb-ui/pages/User/LessonPage/QuizBlock/utils';

describe('QuizBlock utils test', () => {
  describe('verifyAnswers2 function test', () => {
    test.each([
      [
        '[] -> [] = []',
        [],
        [],
        {
          correct: true,
        },
      ],
      [
        '[true] -> [true,false] = [correct: false]',
        [{ value: 'Test value', correct: true }],
        [true, false],
        {
          result: [],
          correct: false,
        },
      ],
      [
        '[true] -> [false] = [0:false]',
        [{ value: 'Test value1', correct: true }],
        [false],
        {
          result: [{ value: 'Test value1', correct: false }],
          correct: false,
        },
      ],
      [
        '[false, false] -> [true,true] = [0:true, 1:true]',
        [
          { value: 'Test value1', correct: false },
          { value: 'Test value2', correct: false },
        ],
        [true, true],
        {
          result: [
            { value: 'Test value1', correct: true },
            { value: 'Test value2', correct: true },
          ],
          correct: false,
        },
      ],
      [
        '[false, true] -> [true,false] = [0:true, 1:false]',
        [
          { value: 'Test value1', correct: false },
          { value: 'Test value2', correct: true },
        ],
        [true, false],
        {
          result: [
            { value: 'Test value1', correct: true },
            { value: 'Test value2', correct: false },
          ],
          correct: false,
        },
      ],
      [
        '[true, true] -> [true,false] = [1:true]',
        [
          { value: 'Test value1', correct: true },
          { value: 'Test value2', correct: true },
        ],
        [true, false],
        {
          result: [{ value: 'Test value2', correct: false }],
          correct: false,
        },
      ],
      [
        '[true, false] -> [true,false] = correct',
        [
          { value: 'Test value1', correct: true },
          { value: 'Test value2', correct: false },
        ],
        [true, false],
        {
          correct: true,
        },
      ],
      [
        '[true, true, true] -> [true,false,true] = [1: false]',
        [
          { value: 'Test value1', correct: true },
          { value: 'Test value2', correct: true },
          { value: 'Test value3', correct: true },
        ],
        [true, false, true],
        {
          result: [{ value: 'Test value2', correct: false }],
          correct: false,
        },
      ],
    ])('%s', (_, answers, correctAnswers, expectedResult) => {
      const result = verifyAnswers(answers, correctAnswers);
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
