import { Col, Empty, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { getEnrolledLessons } from '@sb-ui/utils/api/v1/lesson';
import {
  PAGE_SHORT_SIZE,
  USER_ENROLLED_SHORT_LESSONS_BASE_KEY,
} from '@sb-ui/components/molecules/LessonsMain/constants';
import emptyImg from '../../../../resources/img/empty.svg';
import CurrentLesson from '../../../atoms/CurrentLesson';

import {
  LessonsColumn,
  LessonsMainEmpty,
  LessonsMainRow,
} from './LessonsMain.styled';

const LessonsMain = () => {
  const { t } = useTranslation();
  const { isLoading, data: responseData } = useQuery(
    [
      USER_ENROLLED_SHORT_LESSONS_BASE_KEY,
      {
        limit: PAGE_SHORT_SIZE,
      },
    ],
    getEnrolledLessons,
    { keepPreviousData: true },
  );
  const { data: lessons } = responseData || {};

  if (isLoading || lessons?.length > 0) {
    return (
      <LessonsMainRow gutter={[16, 16]}>
        {isLoading ? (
          <>
            <Col xl={{ span: 8 }} lg={{ span: 24 }}>
              <Skeleton avatar />
            </Col>
            <Col xl={{ span: 8 }} lg={{ span: 24 }}>
              <Skeleton avatar />
            </Col>
            <Col xl={{ span: 8 }} lg={{ span: 24 }}>
              <Skeleton avatar />
            </Col>
          </>
        ) : (
          <>
            {lessons?.map((lesson) => (
              <LessonsColumn xl={{ span: 8 }} lg={{ span: 24 }}>
                <CurrentLesson lesson={lesson} />
              </LessonsColumn>
            ))}
          </>
        )}
      </LessonsMainRow>
    );
  }

  return (
    <LessonsMainEmpty>
      <Empty
        image={emptyImg}
        description={t('user_home.open_lessons.not_found')}
      />
    </LessonsMainEmpty>
  );
};

export default LessonsMain;
