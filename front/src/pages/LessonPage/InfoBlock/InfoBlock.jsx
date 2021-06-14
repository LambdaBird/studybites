import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Skeleton, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import * as S from './InfoBlock.styled';

const { Title, Text } = Typography;

const InfoBlock = ({ isLoading, lesson }) => {
  const { t } = useTranslation();

  const authors = useMemo(
    () =>
      lesson.authors
        ?.map((author) => `${author.firstName} ${author.lastName}`)
        .join(', ') || '',
    [lesson.authors],
  );

  return (
    <S.BlockWrapper justify="start" align="top">
      {isLoading ? (
        <Skeleton loading={isLoading} paragraph={{ rows: 2 }} active />
      ) : (
        <>
          <Title level={2}>{lesson.name}</Title>
          <S.StyledRow justify="space-between">
            <Text type="secondary">
              {t('lesson.by')} {authors}
            </Text>
            <Text type="secondary">0 {t('lesson.blocks')}</Text>
          </S.StyledRow>
        </>
      )}
    </S.BlockWrapper>
  );
};

InfoBlock.propTypes = {
  lesson: PropTypes.shape({
    name: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    blocks: PropTypes.number.isRequired,
    authors: PropTypes.arrayOf({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  }),
  isLoading: PropTypes.bool.isRequired,
};

InfoBlock.defaultProps = {
  lesson: {},
};

export default InfoBlock;
