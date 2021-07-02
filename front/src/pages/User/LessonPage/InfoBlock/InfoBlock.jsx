import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Skeleton, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import * as S from './InfoBlock.styled';

const { Text } = Typography;

const InfoBlock = ({ isLoading, lesson, total }) => {
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
          <S.TitleEllipsis
            ellipsis={{
              tooltip: true,
            }}
            level={2}
          >
            {lesson.name}
          </S.TitleEllipsis>
          <S.StyledRow justify="space-between">
            <Text type="secondary">
              {t('lesson.by')} {authors}
            </Text>
            <Text type="secondary">
              {total} {t('lesson.blocks')}
            </Text>
          </S.StyledRow>
        </>
      )}
    </S.BlockWrapper>
  );
};

InfoBlock.propTypes = {
  lesson: PropTypes.shape({
    name: PropTypes.string,

    authors: PropTypes.arrayOf(
      PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    ),
  }),
  total: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

InfoBlock.defaultProps = {
  lesson: {},
};

export default InfoBlock;
