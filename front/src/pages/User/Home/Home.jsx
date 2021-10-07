import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import { sbPostfix } from '@sb-ui/utils/constants';
import { ChildrenType } from '@sb-ui/utils/types';

import OngoingLessons from './OngoingLessons';
import OpenCourses from './OpenCourses';
import OpenLessons from './OpenLessons';
import * as S from './Home.styled';

const Home = ({ children }) => {
  const { t } = useTranslation('user');

  return (
    <>
      <Helmet>
        <title>
          {t('pages.home')}
          {sbPostfix}
        </title>
      </Helmet>
      <S.Main>
        <OngoingLessons />
        <OpenLessons />
        <OpenCourses />
      </S.Main>
      {children}
    </>
  );
};

Home.propTypes = {
  children: ChildrenType,
};

export default Home;
