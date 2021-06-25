import PropTypes from 'prop-types';
import { Col, Typography } from 'antd';
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import { verifyAnswers } from '@sb-ui/pages/LessonPage/QuizBlock/utils';
import Block from '@sb-ui/pages/LessonPage/Block';
import * as S from './Quizblock.styled';

const { Text } = Typography;
const QuizBlock = ({ isResult, data, setQuiz, correctAnswer }) => {
  const { answers, question } = data;

  const options = answers?.map(({ value, correct }, i) => ({
    label: value,
    value: i,
    correct,
  }));

  if (isResult) {
    const { correct, difference } = verifyAnswers(
      answers.map((x) => x.correct),
      correctAnswer?.results,
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
              defaultValue={options
                ?.map((x) => (x.correct ? x.value : null))
                .filter((x) => x !== null)}
              disabled
              onChange={(e) => setQuiz(e)}
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
                defaultValue={difference
                  .map((x, i) => (x === true && options[i].correct ? i : null))
                  .filter((x) => x !== null)}
                options={difference
                  .map((x, i) =>
                    x === true
                      ? {
                          label: options[i].label,
                          value: i,
                        }
                      : null,
                  )
                  .filter((x) => x !== null)}
              />
            </>
          )}
        </Block>
      </>
    );
  }

  return (
    <S.PageRow justify="center" align="top">
      <S.BlockCol span={24}>
        <S.BlockWrapperWhite justify="start" align="top">
          <S.StyledRow justify="space-between">
            <Col span={24}>
              <S.ColumnCheckbox
                defaultValue={[-1]}
                onChange={(e) => setQuiz(e)}
                options={JSON.parse(JSON.stringify(options))}
              />
            </Col>
          </S.StyledRow>
        </S.BlockWrapperWhite>
      </S.BlockCol>
    </S.PageRow>
  );
};

QuizBlock.propTypes = {
  correctAnswer: {
    results: PropTypes.array.isRequired,
  },
  setQuiz: PropTypes.func,
  isResult: PropTypes.bool,
  data: PropTypes.shape({
    answers: PropTypes.arrayOf({
      label: PropTypes.string,
    }).isRequired,
    question: PropTypes.string.isRequired,
  }),
};

export default QuizBlock;
