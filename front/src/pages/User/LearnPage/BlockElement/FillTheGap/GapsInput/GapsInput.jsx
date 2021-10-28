import PropTypes from 'prop-types';
import React from 'react';

import { htmlToReact } from '@sb-ui/pages/User/LearnPage/utils';

import * as S from './GapsInput.styled';

const GapsInput = ({ gaps, setGaps, disabled, result }) => {
  const handleInputChange = (id, value) => {
    setGaps((prev) => {
      const newGaps = [...prev];
      newGaps.find((gap) => gap.id === id).value = value;
      return newGaps;
    });
  };

  return (
    <S.Wrapper>
      {gaps?.map(({ value, id, type }) => {
        if (type === 'text') {
          return <span key={id}>{htmlToReact(value)}</span>;
        }
        if (result) {
          const { value: resultValue, correct: correctValue } =
            result.find((x) => x.id === id) || {};

          return (
            <React.Fragment key={id}>
              {correctValue ? (
                <S.CorrectSpan>{resultValue}</S.CorrectSpan>
              ) : (
                <S.WrongSpan>{resultValue?.[0]}</S.WrongSpan>
              )}
            </React.Fragment>
          );
        }

        return (
          <S.Input
            key={id}
            value={value}
            onChange={(e) => handleInputChange(id, e.target.value)}
            disabled={disabled}
          />
        );
      })}
    </S.Wrapper>
  );
};

GapsInput.propTypes = {
  gaps: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      id: PropTypes.number,
      type: PropTypes.oneOf(['text', 'input']),
    }),
  ),
  setGaps: PropTypes.func,
  disabled: PropTypes.bool,
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
};

export default GapsInput;
