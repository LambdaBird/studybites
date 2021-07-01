import { Col, Row, Skeleton } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import emptyImg from '@sb-ui/resources/img/empty.svg';
import LessonBlock, { PUBLIC_LESSON } from '@sb-ui/components/LessonBlock';
import { PAGE_SIZE } from './constants';
import { useLessons } from './useLessons';
import * as S from './PublicLessons.mobile.styled';

const PublicLessonsMobile = ({ searchLessons }) => {
  const { t } = useTranslation();
  const {
    data,
    total,
    currentPage,
    isLoading,
    isSuccess,
    isPreviousData,
    onChangeLessonsPage,
  } = useLessons(searchLessons);

  if (isSuccess && data?.length === 0) {
    return (
      <S.Main>
        <S.Container
          image={emptyImg}
          description={t('user_home.open_lessons.not_found')}
        />
      </S.Main>
    );
  }

  return (
    <>
      {isLoading || isPreviousData ? (
        <S.Main gutter={[32, 16]}>
          <Col>
            <Skeleton avatar paragraph={{}} />
          </Col>
          <Col>
            <Skeleton avatar paragraph={{}} />
          </Col>
          <Col>
            <Skeleton avatar paragraph={{}} />
          </Col>
          <Col>
            <Skeleton avatar paragraph={{}} />
          </Col>
        </S.Main>
      ) : (
        <>
          <S.Main gutter={[0, 16]}>
            {data?.map((lesson) => (
              <S.Column key={lesson.id}>
                <LessonBlock type={PUBLIC_LESSON} lesson={lesson} />
              </S.Column>
            ))}
            <Row justify="end">
              {!isLoading && total > PAGE_SIZE && (
                <S.Pages
                  current={currentPage}
                  total={total}
                  pageSize={PAGE_SIZE}
                  onChange={onChangeLessonsPage}
                  showSizeChanger={false}
                />
              )}
            </Row>
          </S.Main>
        </>
      )}
    </>
  );
};

PublicLessonsMobile.defaultProps = {
  searchLessons: null,
};

PublicLessonsMobile.propTypes = {
  searchLessons: PropTypes.string,
};

export default PublicLessonsMobile;
