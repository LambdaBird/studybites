import PropTypes from 'prop-types';

export const LessonsListPropTypes = {
  lessons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }),
  ),
  isLoading: PropTypes.bool.isRequired,
};
