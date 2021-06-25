import { verifyAnswers } from '@sb-ui/pages/LessonPage/QuizBlock/utils';
import Block from '@sb-ui/pages/LessonPage/Block';
import { Col, Typography } from 'antd';
import * as S from '@sb-ui/pages/LessonPage/QuizBlockResult/QuizblockResult.styled';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

const { Text } = Typography;

const QuizBlockResult = ({ data, correctAnswer }) => {
  const { answers, question } = data;

  const options = answers?.map(({ value, correct }, i) => ({
    label: value,
    value: i,
    correct,
  }));

  const { correct, difference } = verifyAnswers(
    answers.map((x) => x.correct),
    correctAnswer?.results,
  );

  const defaultValueAnswers = useMemo(
    () =>
      options
        ?.map((x) => (x.correct ? x.value : null))
        .filter((x) => x !== null),
    [options],
  );

  const defaultValueCorrect = useMemo(
    () =>
      difference
        ?.map((x, i) => (x === true && options[i].correct ? i : null))
        ?.filter((x) => x !== null),
    [difference],
  );

  const optionsDifference = useMemo(
    () =>
      difference
        ?.map((x, i) =>
          x === true
            ? {
                label: options[i].label,
                value: i,
              }
            : null,
        )
        ?.filter((x) => x !== null),
    [difference, options],
  );

  return (
    <>
      <Block>
        <Col span={24}>
          <Text style={{ fontStyle: 'italic' }}>{question}</Text>
        </Col>
      </Block>
      <Block top="1rem">
        <Col span={24}>
          <S.ColumnCheckbox
            defaultValue={defaultValueAnswers}
            disabled
            options={options}
          />
        </Col>
        <Col span={24} />
      </Block>
      <Block padding="1rem 2rem" top="1rem">
        {correct ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text>You`r right !</Text>
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>Wrong :(</Text>
              <CloseCircleTwoTone twoToneColor="#F5222D" />
            </div>

            <S.ColumnCheckbox
              disabled
              defaultValue={defaultValueCorrect}
              options={optionsDifference}
            />
          </>
        )}
      </Block>
    </>
  );
};

QuizBlockResult.propTypes = {
  correctAnswer: {
    results: PropTypes.array.isRequired,
  },
  data: PropTypes.shape({
    answers: PropTypes.arrayOf({
      label: PropTypes.string,
    }).isRequired,
    question: PropTypes.string.isRequired,
  }),
};

export default QuizBlockResult;
