import LessonsDashboard from './LessonsDashboard';
import StudentsList from './StudentsList';
import TeacherInfo from './TeacherInfo';
import * as S from './Home.styled';

const Home = () => (
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

export default Home;
