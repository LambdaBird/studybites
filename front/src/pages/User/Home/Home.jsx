import PropTypes from 'prop-types';

import LessonsList from './LessonsList';
import OngoingLessons from './OngoingLessons';
import * as S from './Home.styled';

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
