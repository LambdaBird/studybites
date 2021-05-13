import React from 'react';
import PropTypes from 'prop-types';
import { getPasswordStrength } from '../../../utils';

const getWrapperStyle = (height) => ({
  lineHeight: `${height}px`,
});

const getIndicatorStyle = (color, height) => ({
  display: 'inline-block',
  width: '25%',
  backgroundColor: color,
  height: `${height}px`,
  borderRadius: '2px',
});

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
      <div
        key={`${color}${i}`}
        style={getIndicatorStyle(color, settings.height)}
      />
      /* eslint-enable */
    ));
  return <div style={getWrapperStyle(settings.height)}>{indicators}</div>;
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
