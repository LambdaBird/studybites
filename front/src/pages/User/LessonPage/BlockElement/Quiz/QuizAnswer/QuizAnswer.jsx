import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';

import * as S from './QuizAnswer.styled';

const QuizAnswer = ({ setQuiz, question, answers }) => {
  const { t } = useTranslation('user');

  const options = answers?.map(({ value, correct }, i) => ({
    label: value,
    value: i,
    correct,
  }));

  return (
    <>
      <ChunkWrapper>
        <S.Question>{question}</S.Question>
      </ChunkWrapper>
      <S.BlockWrapperWhite>
        <S.ColumnCheckbox
          defaultValue={[-1]}
          onChange={(e) => setQuiz(e)}
          options={JSON.parse(JSON.stringify(options))}
        />
        <S.ButtonWrapper>
          <S.LessonButtonSend>{t('lesson.send')}</S.LessonButtonSend>
        </S.ButtonWrapper>
      </S.BlockWrapperWhite>
    </>
  );
};

QuizAnswer.propTypes = {
  setQuiz: PropTypes.func,

  answers: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
    }),
  ).isRequired,
  question: PropTypes.string.isRequired,
};

export default QuizAnswer;
