import PropTypes from 'prop-types';
import { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LearnContext from '@sb-ui/contexts/LearnContext';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';
import {
  BlockIdType,
  RevisionType,
} from '@sb-ui/pages/User/LessonPage/BlockElement/types';
import { RESPONSE_TYPE } from '@sb-ui/pages/User/LessonPage/utils';

import * as S from './QuizAnswer.styled';

const QuizAnswer = ({ blockId, revision, question, answers }) => {
  const { t } = useTranslation('user');
  const { handleInteractiveClick, id } = useContext(LearnContext);
  const [quizCheckbox, setQuizCheckbox] = useState([]);

  const options = answers?.map(({ value, correct }, i) => ({
    label: value,
    value: i,
    correct,
  }));

  const sendAnswers = useMemo(
    () => answers.map((x, i) => !!quizCheckbox.includes(i)),
    [answers, quizCheckbox],
  );

  return (
    <>
      <ChunkWrapper isBottom>
        <S.Question>{question}</S.Question>
      </ChunkWrapper>
      <S.BlockWrapperWhite>
        <S.ColumnCheckbox onChange={setQuizCheckbox} options={options} />
        <S.ButtonWrapper>
          <S.LessonButtonSend
            onClick={() =>
              handleInteractiveClick({
                id,
                action: RESPONSE_TYPE,
                blockId,
                revision,
                data: { response: sendAnswers },
              })
            }
          >
            {t('lesson.send')}
          </S.LessonButtonSend>
        </S.ButtonWrapper>
      </S.BlockWrapperWhite>
    </>
  );
};

QuizAnswer.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  answers: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
    }),
  ).isRequired,
  question: PropTypes.string.isRequired,
};

export default QuizAnswer;
