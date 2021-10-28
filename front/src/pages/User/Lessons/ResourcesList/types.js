import PropTypes from 'prop-types';

export const LessonsListPropTypes = {
  title: PropTypes.string.isRequired,
  notFound: PropTypes.string.isRequired,
  resourceKey: PropTypes.string.isRequired,
  isFinished: PropTypes.bool,
  query: PropTypes.shape({
    key: PropTypes.string.isRequired,
    func: PropTypes.func.isRequired,
  }),
};
