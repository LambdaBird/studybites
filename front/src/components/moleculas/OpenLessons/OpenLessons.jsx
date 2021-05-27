import React, { useState } from 'react';
import { Col, Row, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import DebouncedSearch from '../../atoms/DebounedSearch';
import LessonsMain from './LessonsMain';
import { LessonsHeader } from './OpenLessons.styled';

const { Title } = Typography;

const publicLessons = new Array(100).fill(1).map((x, i) => ({
  id: i + 1,
  title: `How to use StudyBites${i + 1}`,
  author: `John Galt${i + 1}`,
  description:
    'Open repair of infrarenal aortic aneurysm or dissection, plus repair of associated arterial trauma, following unsuccessful endovascular repair; tube prosthesis',
}));

const OpenLessons = () => {
  const { t } = useTranslation();

  const [lessons, setLessons] = useState(publicLessons);

  const onSearchChange = (data) => {
    setLessons(
      publicLessons.filter(
        (x) => x.title.includes(data) || x.author.includes(data),
      ),
    );
  };

  return (
    <>
      <LessonsHeader justify="space-between" align="middle">
        <Col>
          <Row>
            <Space size="large">
              <Title level={2}>{t('user_home.title')}</Title>
              <DebouncedSearch
                delay={500}
                placeholder={t('user_home.search.placeholder')}
                allowClear
                onSearch={onSearchChange}
                onChange={onSearchChange}
              />
            </Space>
          </Row>
        </Col>
      </LessonsHeader>
      <LessonsMain lessons={lessons} />
    </>
  );
};

export default OpenLessons;
