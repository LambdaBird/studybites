import React from 'react';
import PropTypes from 'prop-types';
import { getPasswordStrength } from '../../../utils';
import { IndicatorDiv, LineDiv } from './PasswordStrengthIndicator.styled';

const PasswordStrengthIndicator = ({ value, settings }) => {
  const { levels, noLevel } = settings.colorScheme;
  let level = getPasswordStrength(value);
  if (value.length === 0) {
    level = -1;
  }
  const indicators = levels
    .map((color, i) => (i <= level ? color : noLevel))
    .map((color, i) => (
      /*eslint-disable */
      <IndicatorDiv
        key={`${color}${i}`}
        color={color}
        height={settings.height}
      />
      /* eslint-enable */
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
