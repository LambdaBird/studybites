import PropTypes from 'prop-types';
import OngoingShort from './OngoingShort';
import OngoingFull from './OngoingFull';
import Public from './Public';
import Teacher from './Teacher';

export const ONGOING_SHORT_LESSON = 'ongoingShort';
export const ONGOING_FULL_LESSON = 'ongoingFull';
export const PUBLIC_LESSON = 'public';
export const TEACHER_LESSON = 'teacher';

const LessonBlock = (props) => {
  const { type } = props;
  if (type === ONGOING_FULL_LESSON) {
    return <OngoingFull {...props} />;
  }
  if (type === ONGOING_SHORT_LESSON) {
    return <OngoingShort {...props} />;
  }
  if (type === PUBLIC_LESSON) {
    return <Public {...props} />;
  }
  if (type === TEACHER_LESSON) {
    return <Teacher {...props} />;
  }

  return null;
};

LessonBlock.propTypes = {
  type: PropTypes.oneOf(['public', 'teacher', 'ongoing']).isRequired,
  lesson: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    maintainer: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }),
};

export default LessonBlock;
