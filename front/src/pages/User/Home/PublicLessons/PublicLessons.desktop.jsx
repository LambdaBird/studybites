import { Col, Row, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import emptyImg from '@sb-ui/resources/img/empty.svg';
import LessonBlock, { PUBLIC_LESSON } from '@sb-ui/components/LessonBlock';
import { PAGE_SIZE } from './constants';
import { useLessons } from './useLessons';
import * as S from './PublicLessons.desktop.styled';

const LessonsMainDesktop = ({ searchLessons }) => {
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
      <S.LessonsMainDiv>
        <S.LessonsEmpty
          image={emptyImg}
          description={t('user_home.open_lessons.not_found')}
        />
      </S.LessonsMainDiv>
    );
  }

  return (
    <S.LessonsMainDiv>
      {isLoading || isPreviousData ? (
        <Row gutter={[16, 16]}>
          <Col lg={{ span: 12 }} md={{ span: 24 }}>
            <Skeleton avatar />
          </Col>
          <Col lg={{ span: 12 }} md={{ span: 24 }}>
            <Skeleton avatar />
          </Col>
          <Col lg={{ span: 12 }} md={{ span: 24 }}>
            <Skeleton avatar />
          </Col>
          <Col lg={{ span: 12 }} md={{ span: 24 }}>
            <Skeleton avatar />
          </Col>
        </Row>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {data?.map((lesson) => (
              <S.LessonsColumn
                key={lesson.id}
                lg={{ span: 12 }}
                md={{ span: 24 }}
              >
                <LessonBlock type={PUBLIC_LESSON} lesson={lesson} />
              </S.LessonsColumn>
            ))}
          </Row>
          <Row justify="end">
            {!isLoading && total > PAGE_SIZE && (
              <S.LessonsPagination
                current={currentPage}
                total={total}
                pageSize={PAGE_SIZE}
                onChange={onChangeLessonsPage}
                showSizeChanger={false}
              />
            )}
          </Row>
        </>
      )}
    </S.LessonsMainDiv>
  );
};

LessonsMainDesktop.defaultProps = {
  searchLessons: null,
};

LessonsMainDesktop.propTypes = {
  searchLessons: PropTypes.string,
};

export default LessonsMainDesktop;
