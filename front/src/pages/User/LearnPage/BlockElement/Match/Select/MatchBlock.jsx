import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import * as S from './Select.styled';

export const MATCH_BLOCK_TYPE = {
  RESULT: 'result',
  SELECT: 'select',
  NORMAL: 'normal',
};

export const MatchBlock = forwardRef((props, ref) => {
  switch (props.type) {
    case MATCH_BLOCK_TYPE.RESULT:
      return <S.MatchBlockResult ref={ref} {...props} />;
    case MATCH_BLOCK_TYPE.SELECT:
      return <S.MatchBlockSelect ref={ref} {...props} />;
    case MATCH_BLOCK_TYPE.NORMAL:
    default:
      return <S.MatchBlockNormal ref={ref} {...props} />;
  }
});

MatchBlock.propTypes = {
  type: PropTypes.oneOf(Object.values(MATCH_BLOCK_TYPE)),
};
