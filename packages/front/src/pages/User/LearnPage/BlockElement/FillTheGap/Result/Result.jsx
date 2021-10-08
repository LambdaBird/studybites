import { Typography } from 'antd';
import PropTypes from 'prop-types';

import GapsInput from '@sb-ui/pages/User/LearnPage/BlockElement/FillTheGap/GapsInput';

import { CORRECT_ALL, CORRECT_NONE, CORRECT_PARTIAL } from '../constants';

import ResultTitle from './ResultTitle';
import * as S from './Result.styled';

const { Text } = Typography;

const Result = ({ correct, result, gaps }) => (
  <>
    <ResultTitle correct={correct} />
    {correct !== CORRECT_ALL && (
      <S.ResultWrapper>
        <Text italic>
          <GapsInput gaps={gaps} result={result} />
        </Text>
      </S.ResultWrapper>
    )}
  </>
);

Result.propTypes = {
  correct: PropTypes.oneOf([CORRECT_ALL, CORRECT_NONE, CORRECT_PARTIAL]),
  result: PropTypes.arrayOf(
    PropTypes.shape({
      correct: PropTypes.bool,
      value: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string,
      ]),
      id: PropTypes.number,
      type: PropTypes.oneOf(['text', 'input']),
    }),
  ),
  gaps: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      id: PropTypes.number,
      type: PropTypes.oneOf(['text', 'input']),
    }),
  ),
};

export default Result;
