import TeacherInfo from './TeacherInfo';
import StudentsList from './StudentsList';
import LessonsDashboard from './LessonsDashboard';
import * as S from './TeacherHome.styled';

const TeacherHome = () => (
  <S.Page>
    <S.StyledRow gutter={[32]} justify="center" align="top">
      <S.LeftCol>
        <TeacherInfo />
        <LessonsDashboard />
      </S.LeftCol>
      <S.RightCol>
        <StudentsList />
      </S.RightCol>
    </S.StyledRow>
  </S.Page>
);

export default TeacherHome;
