import { Typography } from 'antd';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import ColumnDisabledCheckbox from '@sb-ui/components/atoms/ColumnDisabledCheckbox';
import { htmlToReact } from '@sb-ui/pages/User/LearnPage/utils';

import * as S from './AnswerResult.styled';

const { Text } = Typography;

const AnswerResult = ({ correct, result }) => {
  const { t } = useTranslation('user');

  const options = useMemo(
    () =>
      result?.map((x, i) => ({
        label: htmlToReact(x.value),
        value: i,
      })),
    [result],
  );

  const value = useMemo(
    () =>
      result?.map((x, i) => (x.correct ? i : null)).filter((x) => x !== null),
    [result],
  );

  return (
    <>
      {correct ? (
        <S.AnswerWrapper>
          <Text>{t('lesson.answer_result.correct')}</Text>
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        </S.AnswerWrapper>
      ) : (
        <>
          <S.AnswerWrapper>
            <Text>{t('lesson.answer_result.wrong')}</Text>
            <CloseCircleTwoTone twoToneColor="#F5222D" />
          </S.AnswerWrapper>

          <ColumnDisabledCheckbox value={value} options={options} />
        </>
      )}
    </>
  );
};

AnswerResult.propTypes = {
  result: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      correct: PropTypes.bool.isRequired,
    }),
  ),
  correct: PropTypes.bool.isRequired,
};

export default AnswerResult;
