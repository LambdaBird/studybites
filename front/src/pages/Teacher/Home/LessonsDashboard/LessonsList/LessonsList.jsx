import TeacherLesson from '@sb-ui/components/resourceBlocks/Teacher';

import AddCard from '../AddCard';
import { LessonsListPropTypes } from '../types';

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

LessonsList.defaultProps = {
  lessons: [],
};

LessonsList.propTypes = LessonsListPropTypes;

export default LessonsList;
