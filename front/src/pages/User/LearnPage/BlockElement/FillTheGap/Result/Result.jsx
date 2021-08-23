import { Typography } from 'antd';
import PropTypes from 'prop-types';

import Inputs from '@sb-ui/pages/User/LearnPage/BlockElement/FillTheGap/Inputs';

import { CORRECT_ALL, CORRECT_NONE, CORRECT_PARTIAL } from '../constants';

import CorrectTitle from './CorrectTitle';
import PartialCorrectTitle from './PartialCorrectTitle';
import WrongTitle from './WrongTitle';
import * as S from './Result.styled';

const { Text } = Typography;

const Result = ({ correct, result, text }) => {
  if (correct === CORRECT_ALL) {
    return <CorrectTitle />;
  }
  return (
    <>
      {correct === CORRECT_PARTIAL && <PartialCorrectTitle />}
      {correct === CORRECT_NONE && <WrongTitle />}
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
