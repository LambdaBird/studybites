import PropTypes from 'prop-types';
import * as S from './Home.styled';
import OngoingLessons from './OngoingLessons';
import LessonsList from './LessonsList';

const Home = ({ children }) => (
  <>
    <S.Main>
      <OngoingLessons />
      <LessonsList />
    </S.Main>
    {children}
  </>
);

Home.propTypes = {
  children: PropTypes.node,
};

export default Home;
