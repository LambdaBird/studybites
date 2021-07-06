import PropTypes from 'prop-types';

export const BlockElementProps = {
  element: PropTypes.shape({
    content: PropTypes.shape({
      type: PropTypes.string.isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      data: PropTypes.object.isRequired,
    }).isRequired,
    blockId: PropTypes.string.isRequired,
    answer: PropTypes.shape({
      results: PropTypes.arrayOf(PropTypes.bool),
    }),
  }),
};
