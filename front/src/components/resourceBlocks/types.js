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
  keywords: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
};

export const LessonType = PropTypes.shape({
  ...LessonGeneralType,
  percentage: PropTypes.number,
  isFinished: PropTypes.bool,
});

export const PublicResourceType = PropTypes.shape({
  ...LessonGeneralType,
  isEnrolled: PropTypes.bool.isRequired,
});
