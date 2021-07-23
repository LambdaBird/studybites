import PropTypes from 'prop-types';

const MaintainersType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }),
);

export const LessonType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  maintainers: MaintainersType,
  percentage: PropTypes.number,
});

export const PublicLessonType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  maintainers: MaintainersType,
  isEnrolled: PropTypes.bool.isRequired,
});
