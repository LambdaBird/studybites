import PropTypes from 'prop-types';

const AuthorType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
});

export const GeneralLessonType = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  author: AuthorType,
  keywords: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
};

export const LessonType = PropTypes.shape({
  ...GeneralLessonType,
  percentage: PropTypes.number,
  isFinished: PropTypes.bool,
});

export const PublicLessonType = PropTypes.shape({
  ...GeneralLessonType,
  isEnrolled: PropTypes.bool.isRequired,
});
