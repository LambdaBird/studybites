import { Skeleton, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import * as S from './InfoBlock.styled';

const { Text } = Typography;

const InfoBlock = ({ isLoading, lesson, total }) => {
  const { t } = useTranslation('user');

  const author = useMemo(
    () => 
      `${lesson.author?.firstName} ${lesson.author?.lastName}`,
    [lesson.author],
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
              {t('lesson.by')} {author}
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

    author: 
      PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
  }),
  total: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

InfoBlock.defaultProps = {
  lesson: {},
};

export default InfoBlock;
