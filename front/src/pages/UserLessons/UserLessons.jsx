import { Col, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch/DebouncedSearch';
import * as S from './UserLessons.styled';
import OngoingLessonsList from './UserLessonsList';

const UserLessons = () => {
  const { t } = useTranslation();

  return (
    <S.MainDiv>
      <OngoingLessonsList />
      <S.LessonsHeader justify="space-between">
        <Col>
          <Row justify="center" align="middle">
            <Space size="large">
              <S.OpenLessonsTitle level={4}>
                {t('user_lessons.finished_lessons.title')}
              </S.OpenLessonsTitle>
              <DebouncedSearch
                delay={500}
                placeholder={t('user_home.open_lessons.search')}
                allowClea
                onChange={() => {}}
              />
            </Space>
          </Row>
        </Col>
      </S.LessonsHeader>
    </S.MainDiv>
  );
};

export default UserLessons;
