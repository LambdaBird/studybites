import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as S from './Home.styled';
import OngoingLessons from './OngoingLessons';
import PublicLessons from './PublicLessons';

const Home = ({ children }) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState(null);

  return (
    <>
      <S.Main>
        <OngoingLessons />
        <S.OpenHeader justify="space-between" align="middle">
          <S.Column>
            <S.Container>
              <S.OpenTitle level={4}>
                {t('user_home.open_lessons.title')}
              </S.OpenTitle>
              <S.StyledSearch
                searchText={searchText}
                setSearchText={setSearchText}
              />
            </S.Container>
          </S.Column>
        </S.OpenHeader>
        <PublicLessons searchLessons={searchText} />
      </S.Main>
      {children}
    </>
  );
};

Home.propTypes = {
  children: PropTypes.node,
};

export default Home;
