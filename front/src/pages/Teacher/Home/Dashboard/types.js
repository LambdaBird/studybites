import PropTypes from 'prop-types';

export const LessonsListPropTypes = {
  lessons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }),
  ),
  isCourse: PropTypes.bool,
  onCreateLesson: PropTypes.func.isRequired,
  isAddNewShown: PropTypes.bool.isRequired,
};

export const AddCardPropTypes = {
  onClick: PropTypes.func.isRequired,
  isCourse: PropTypes.bool.isRequired,
};
