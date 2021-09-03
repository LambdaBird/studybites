import PropTypes from 'prop-types';

const AuthorType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
});

const LessonGeneralType = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  author: AuthorType,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};

export const LessonType = PropTypes.shape({
  ...LessonGeneralType,
  percentage: PropTypes.number,
  isFinished: PropTypes.bool,
});

export const PublicLessonType = PropTypes.shape({
  ...LessonGeneralType,
  isEnrolled: PropTypes.bool.isRequired,
});
