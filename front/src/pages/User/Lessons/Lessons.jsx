import {
  USER_ENROLLED_LESSONS_BASE_KEY,
  USER_ENROLLED_LESSONS_FINISHED_BASE_KEY,
} from '@sb-ui/utils/queries';
import {
  getEnrolledLessons,
  getEnrolledLessonsFinished,
} from '@sb-ui/utils/api/v1/lesson';
import { useTranslation } from 'react-i18next';
import * as S from './Lessons.styled';
import UserLessonsList from './UserLessonsList';

const Lessons = () => {
  const { t } = useTranslation();

  return (
    <S.MainDiv>
      <UserLessonsList
        title={t('user_lessons.ongoing_lessons.title')}
        query={{
          key: USER_ENROLLED_LESSONS_BASE_KEY,
          func: getEnrolledLessons,
        }}
      />
      <UserLessonsList
        title={t('user_lessons.finished_lessons.title')}
        query={{
          key: USER_ENROLLED_LESSONS_FINISHED_BASE_KEY,
          func: getEnrolledLessonsFinished,
        }}
      />
    </S.MainDiv>
  );
};

export default Lessons;
