import React from 'react';
import PropTypes from 'prop-types';

const getWrapperStyle = (height) => ({
  lineHeight: `${height}px`,
});

const getIndicatorStyle = (color, height) => ({
  display: 'inline-block',
  width: '33%',
  backgroundColor: color,
  height: `${height}px`,
  borderRadius: '2px',
});

const PasswordStrengthIndicator = ({ level, settings }) => {
  if (level < 0) {
    return null;
  }

  const indicators = [];

  let color;
  if (level === -1) {
    color = settings.colorScheme.noLevel;
  }

  for (let i = 0; i < 3; i += 1) {
    if (level !== -1) {
      color = settings.colorScheme.levels[level];
    }
    indicators.push(
      <div
        key={`indicator-${i}`}
        style={getIndicatorStyle(color, settings.height)}
      />,
    );
  }

  return <div style={getWrapperStyle(settings.height)}>{indicators}</div>;
};

PasswordStrengthIndicator.propTypes = {
  level: PropTypes.number.isRequired,
  settings: PropTypes.exact({
    colorScheme: {
      levels: PropTypes.arrayOf(PropTypes.string),
      noLevel: PropTypes.string,
    },
    height: PropTypes.number,
  }).isRequired,
};

export default PasswordStrengthIndicator;
