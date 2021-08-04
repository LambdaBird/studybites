import PropTypes from 'prop-types';

const AuthorType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
});

export const LessonType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  author: AuthorType,
  percentage: PropTypes.number,
  isFinished: PropTypes.bool,
});

export const LessonsType = PropTypes.arrayOf(LessonType);

export const PublicLessonType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  author: AuthorType,
  isEnrolled: PropTypes.bool.isRequired,
});
