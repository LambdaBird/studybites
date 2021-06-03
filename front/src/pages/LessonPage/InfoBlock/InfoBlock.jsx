import React from 'react';
import PropTypes from 'prop-types';
import { Skeleton, Typography, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import * as S from './InfoBlock.styled';

const { Title, Text } = Typography;

const InfoBlock = ({ isLoading, isError, lessonData }) => {
  console.log('lessonData: ', lessonData, isError);
  const { t } = useTranslation();

  return (
    <S.BlockWrapper justify="start" align="top">
      {isLoading
        ? <Skeleton
            loading={isLoading}
            paragraph={{ rows: 2 }}
            active
          />
        : <>
            <Title level={2}>{lessonData?.data.name}</Title>
            <Row justify="space-between" style={{ width: "100%" }}>
              <Text type="secondary">{t('lesson.by')} {lessonData?.data.author}</Text>
              <Text type="secondary">{lessonData?.data.blocks} {t('lesson.blocks')}</Text>
            </Row>
          </>
      }
    </S.BlockWrapper>
  );
};

InfoBlock.propTypes = {
  lessonData: PropTypes.shape({
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      blocks: PropTypes.number.isRequired,
    }),
  }),
  isLoading: PropTypes.bool,
  isError: PropTypes.string,
};

InfoBlock.defaultProps = {
  lessonData: null,
  isLoading: true,
  isError: null,
};

export default InfoBlock;
