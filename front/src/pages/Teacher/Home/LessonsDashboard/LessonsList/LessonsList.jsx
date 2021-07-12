import PropTypes from 'prop-types';

import TeacherLesson from '@sb-ui/components/lessonBlocks/Teacher';

import AddCard from '../AddCard';

import { CardCol } from '../LessonsDashboard.styled';

const LessonsList = ({ lessons, onCreateLesson, isAddNewShown }) => (
  <>
    {isAddNewShown ? (
      <CardCol span={12}>
        <AddCard onClick={onCreateLesson} />
      </CardCol>
    ) : (
      lessons.map((lesson) => (
        <CardCol key={lesson.id} span={12}>
          <TeacherLesson
            id={lesson.id}
            title={lesson.name}
            students={lesson.students}
            status={lesson.status}
          />
        </CardCol>
      ))
    )}
  </>
);

LessonsList.propTypes = {
  lessons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }),
  ),
  onCreateLesson: PropTypes.func.isRequired,
  isAddNewShown: PropTypes.bool.isRequired,
};

LessonsList.defaultProps = {
  lessons: [],
};

export default LessonsList;
