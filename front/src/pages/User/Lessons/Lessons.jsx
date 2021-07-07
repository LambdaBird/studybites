import {
  USER_ENROLLED_LESSONS_BASE_KEY,
  USER_ENROLLED_LESSONS_FINISHED_BASE_KEY,
} from '@sb-ui/utils/queries';
import {
  getEnrolledLessons,
  getEnrolledLessonsFinished,
} from '@sb-ui/utils/api/v1/student';
import { useTranslation } from 'react-i18next';
import * as S from './Lessons.styled';
import LessonsList from './LessonsList';

const Lessons = () => {
  const { t } = useTranslation('user');

  return (
    <S.MainDiv>
      <LessonsList
        title={t('home.ongoing_lessons.title')}
        query={{
          key: USER_ENROLLED_LESSONS_BASE_KEY,
          func: getEnrolledLessons,
        }}
      />
      <LessonsList
        title={t('home.finished_lessons.title')}
        query={{
          key: USER_ENROLLED_LESSONS_FINISHED_BASE_KEY,
          func: getEnrolledLessonsFinished,
        }}
      />
    </S.MainDiv>
  );
};

export default Lessons;
