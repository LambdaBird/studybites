import { Col, Empty, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import emptyImg from '../../../../resources/img/empty.svg';
import CurrentLesson from '../../../atoms/CurrentLesson';
import { useLessonsRequest } from './useLessonsRequest';

import {
  LessonsColumn,
  LessonsMainEmpty,
  LessonsMainRow,
} from './LessonsMain.styled';

const LessonsMain = () => {
  const { t } = useTranslation();
  const { loading, lessons } = useLessonsRequest();

  if (loading || lessons?.length > 0) {
    return (
      <LessonsMainRow gutter={[16, 16]}>
        {loading ? (
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
