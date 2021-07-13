import PropTypes from 'prop-types';

import TeacherLesson from '@sb-ui/components/lessonBlocks/Teacher';

import AddCard from '../AddCard';

import * as S from '../LessonsDashboard.styled';

const LessonsList = ({ lessons, onCreateLesson, isAddNewShown }) => (
  <>
    {isAddNewShown ? (
      <S.CardCol>
        <AddCard onClick={onCreateLesson} />
      </S.CardCol>
    ) : (
      lessons.map((lesson) => (
        <S.CardCol key={lesson.id}>
          <TeacherLesson
            id={lesson.id}
            title={lesson.name}
            students={lesson.students}
            status={lesson.status}
          />
        </S.CardCol>
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
