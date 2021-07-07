import PropTypes from 'prop-types';

export const BlockElementProps = PropTypes.shape({
  content: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }).isRequired,
  blockId: PropTypes.string.isRequired,
  answer: PropTypes.shape({
    results: PropTypes.arrayOf(PropTypes.bool),
  }),
});
