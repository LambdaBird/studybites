import PropTypes from 'prop-types';

export const LessonsListBlockPropTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
};
