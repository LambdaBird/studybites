import React, { useState } from 'react';
import { Col, Row, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import DebouncedSearch from '../../atoms/DebounedSearch';
import LessonsMain from './LessonsMain';
import { LessonsHeader } from './OpenLessons.styled';

const { Title } = Typography;

const OpenLessons = () => {
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState(null);

  const onSearchChange = (data) => {
    setSearchText(data);
  };

  return (
    <>
      <LessonsHeader justify="space-between" align="middle">
        <Col>
          <Row justify="center" align="middle">
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
      <LessonsMain searchLessons={searchText} />
    </>
  );
};

export default OpenLessons;
