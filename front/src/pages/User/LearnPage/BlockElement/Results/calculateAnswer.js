import { verifyAnswers as verifyBricksAnswers } from '@sb-ui/pages/User/LearnPage/BlockElement/Bricks/verifyAnswers';
import { verifyAnswers as verifyClosedQuestionAnswers } from '@sb-ui/pages/User/LearnPage/BlockElement/ClosedQuestion/Result/verifyAnswers';
import { verifyAnswers as verifyFillTheGapAnswers } from '@sb-ui/pages/User/LearnPage/BlockElement/FillTheGap/verifyAnswers';
import { verifyAnswers as verifyMatchAnswers } from '@sb-ui/pages/User/LearnPage/BlockElement/Match/verifyAnswers';
import { verifyAnswers as verifyQuizAnswers } from '@sb-ui/pages/User/LearnPage/BlockElement/Quiz/verifyAnswers';

export const calculateQuiz = ({ reply, answer, content }) => {
  const userAnswer =
    reply?.response?.map((x) => ({ correct: x })) || content?.data?.answers;
  const { correct } = verifyQuizAnswers(userAnswer, answer?.results);
  return correct;
};

export const calculateClosedQuestion = ({ reply, answer }) =>
  verifyClosedQuestionAnswers(answer.results, reply.value);

export const calculateFillTheGap = ({ reply, answer }) => {
  const { correct } = verifyFillTheGapAnswers(answer.results, reply.response);
  return correct;
};

export const calculateBricks = ({ reply, answer }) => {
  const { words: answerResults } = answer;
  const { words: userWords } = reply;
  return verifyBricksAnswers(userWords, answerResults);
};

export const calculateMatch = ({ reply, answer }) => {
  const { correct } = verifyMatchAnswers(answer?.results, reply?.response);
  return correct;
};
