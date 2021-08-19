import { Typography } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import * as S from '@sb-ui/pages/User/LearnPage/BlockElement/FillTheGap/Result/Result.styled';

import { CORRECT_ALL, CORRECT_NONE, CORRECT_PARTIAL } from '../../constants';

const { Text } = Typography;

const AnswerResult = ({ correct, result, chunks }) => {
  const { t } = useTranslation('user');

  if (correct === CORRECT_ALL) {
    return (
      <S.AnswerWrapper>
        <Text>{t('lesson.answer_result.correct')}</Text>
        <CheckCircleTwoTone twoToneColor="#52c41a" />
      </S.AnswerWrapper>
    );
  }

  return (
    <>
      {correct === CORRECT_PARTIAL && (
        <S.AnswerWrapper>
          <Text>{t('lesson.answer_result.partially_wrong')}</Text>
          <S.WarningTwoTone twoToneColor="#FADB14" />
        </S.AnswerWrapper>
      )}
      {correct === CORRECT_NONE && (
        <S.AnswerWrapper>
          <Text>{t('lesson.answer_result.wrong')}</Text>
          <CloseCircleTwoTone twoToneColor="#F5222D" />
        </S.AnswerWrapper>
      )}
      <S.ResultWrapper>
        <Text italic>
          {chunks.map((chunk, index) => {
            if (index === chunks.length - 1) {
              return <span>{chunk}</span>;
            }
            const { value, correct: correctValue } = result[index];
            return (
              <>
                <span>{chunk}</span>
                {correctValue ? (
                  <S.CorrectSpan>{value}</S.CorrectSpan>
                ) : (
                  <S.WrongSpan>{value}</S.WrongSpan>
                )}
              </>
            );
          })}
        </Text>
      </S.ResultWrapper>
    </>
  );
};

AnswerResult.propTypes = {
  correct: PropTypes.bool,
  result: PropTypes.arrayOf(
    PropTypes.shape({
      correct: PropTypes.bool,
      value: PropTypes.string,
    }),
  ),
  chunks: PropTypes.arrayOf(PropTypes.string),
};

export default AnswerResult;
