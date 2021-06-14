import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Search from '@sb-ui/components/molecules/Search';
import OngoingLessons from '@sb-ui/components/molecules/OngoingLessons';
import LessonsMain from '@sb-ui/components/molecules/LessonsMain';

import useMobile from '@sb-ui/hooks/useMobile';
import UserEnrollModal from '@sb-ui/pages/UserEnrollModal';
import { Route, useLocation, useRouteMatch } from 'react-router-dom';
import * as S from './UserHome.styled';

const UserHome = () => {
  const location = useLocation();

  const { t } = useTranslation();
  const isMobile = useMobile();
  const { path } = useRouteMatch();
  const [searchText, setSearchText] = useState(null);

  if (isMobile && location.pathname.startsWith(`${path}/enroll/`)) {
    return <Route path={`${path}/enroll/:id`} component={UserEnrollModal} />;
  }

  return (
    <>
      <Route>
        <S.Main>
          <OngoingLessons />
          <S.OpenHeader
            justify="space-between"
            align="middle"
            style={{ width: '100%' }}
          >
            <S.Column style={{ width: '100%' }}>
              <S.Container>
                <S.OpenTitle level={3}>
                  {t('user_home.open_lessons.title')}
                </S.OpenTitle>
                <Search setSearchText={setSearchText} />
              </S.Container>
            </S.Column>
          </S.OpenHeader>
          <LessonsMain searchLessons={searchText} />
        </S.Main>
      </Route>
    </>
  );
};

export default UserHome;
