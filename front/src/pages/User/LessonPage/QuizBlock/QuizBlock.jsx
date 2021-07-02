import PropTypes from 'prop-types';
import { Col } from 'antd';

import * as S from './Quizblock.styled';

const QuizBlock = ({ data, setQuiz }) => {
  const { answers } = data;

  const options = answers?.map(({ value, correct }, i) => ({
    label: value,
    value: i,
    correct,
  }));

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
  setQuiz: PropTypes.func,
  data: PropTypes.shape({
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
      }),
    ).isRequired,
    question: PropTypes.string.isRequired,
  }),
};

export default QuizBlock;
