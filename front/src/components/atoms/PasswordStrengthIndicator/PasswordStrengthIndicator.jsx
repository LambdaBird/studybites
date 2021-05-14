import React from 'react';
import PropTypes from 'prop-types';
import { getPasswordStrength } from '../../../utils';
import { IndicatorDiv, LineDiv } from './PasswordStrengthIndicator.styled';

const PasswordStrengthIndicator = ({ value }) => {
  const levelsColor = ['#ff4033', '#fe940d', '#ffd908', '#6ecc3a'];
  const noLevelColor = 'lightgray';
  const level = getPasswordStrength(value);
  const indicators = levelsColor
    .map((color, i) => (i <= level ? levelsColor[level] : noLevelColor))
    .map((color, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <IndicatorDiv key={`${color}${i}`} color={color} height={4} />
    ));
  return <LineDiv>{indicators}</LineDiv>;
};

PasswordStrengthIndicator.propTypes = {
  value: PropTypes.string.isRequired,
  settings: PropTypes.exact({
    colorScheme: {
      levels: PropTypes.arrayOf(PropTypes.string),
      noLevel: PropTypes.string,
    },
    height: PropTypes.number,
  }).isRequired,
};

export default PasswordStrengthIndicator;
