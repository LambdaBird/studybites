import { Typography } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import Inputs from '@sb-ui/pages/User/LearnPage/BlockElement/FillTheGap/Inputs';

import { CORRECT_ALL, CORRECT_NONE, CORRECT_PARTIAL } from '../constants';

import * as S from './Result.styled';

const { Text } = Typography;

const Result = ({ correct, result, text }) => {
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
          <Inputs text={text} result={result} />
        </Text>
      </S.ResultWrapper>
    </>
  );
};

Result.propTypes = {
  correct: PropTypes.oneOf([CORRECT_ALL, CORRECT_NONE, CORRECT_PARTIAL]),
  result: PropTypes.arrayOf(
    PropTypes.shape({
      correct: PropTypes.bool,
      value: PropTypes.string,
    }),
  ),
  text: PropTypes.string,
};

export default Result;
