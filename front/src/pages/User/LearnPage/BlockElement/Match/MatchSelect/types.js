import PropTypes from 'prop-types';

export const MatchSelectBlockType = PropTypes.arrayOf(
  PropTypes.shape({
    ref: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]),
    value: PropTypes.string,
    id: PropTypes.number,
    selected: PropTypes.bool,
    correct: PropTypes.bool,
  }),
);
