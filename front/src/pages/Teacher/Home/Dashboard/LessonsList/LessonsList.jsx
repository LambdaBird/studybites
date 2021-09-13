import { Course, Lesson } from '@sb-ui/components/resourceBlocks/Teacher';

import AddCard from '../AddCard';
import { LessonsListPropTypes } from '../types';

import * as S from '../Dashboard.styled';

const LessonsList = ({ lessons, onCreateLesson, isAddNewShown, isCourse }) => (
  <>
    {isAddNewShown ? (
      <S.CardCol>
        <AddCard onClick={onCreateLesson} isCourse={isCourse} />
      </S.CardCol>
    ) : (
      lessons.map((lesson) => (
        <S.CardCol key={lesson.id}>
          {isCourse ? <Course {...lesson} /> : <Lesson {...lesson} />}
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
