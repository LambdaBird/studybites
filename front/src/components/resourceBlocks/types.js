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

export const PublicResourceType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  author: AuthorType,
  isEnrolled: PropTypes.bool.isRequired,
});
