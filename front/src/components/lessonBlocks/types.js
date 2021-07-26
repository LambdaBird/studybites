import PropTypes from 'prop-types';

export const LessonType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  percentage: PropTypes.number.isRequired,
  author: PropTypes.shape({
    userInfo: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }),
  }),
});

export const PublicLessonType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  isEnrolled: PropTypes.bool.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
});
