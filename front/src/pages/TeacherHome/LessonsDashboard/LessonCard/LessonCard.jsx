import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import * as S from './LessonCard.styled';

const { Title, Text } = Typography;

const LessonCard = ({ cover, title, students }) => {
  const { t } = useTranslation();
    
  return (
    <S.Wrapper justify="center" align="center">
      <S.ImageCol span={8} >
        <S.CardImage
          src={cover}
        />
      </S.ImageCol>
      <S.CardDescription span={16} >
        <S.CardText>
          <Title level={4}>{title}</Title>
          {!students.length
            ? <Text type="secondary">{t('lesson_dashboard.card.no_students')}</Text>
            : null
          }
        </S.CardText>
        <S.CardButton>{t('lesson_dashboard.card.edit')}</S.CardButton>
      </S.CardDescription>
    </S.Wrapper>
  );
};

LessonCard.propTypes = {
  cover: PropTypes.string,
  title: PropTypes.string,
  students: PropTypes.arrayOf(PropTypes.shape({
    avatar: PropTypes.string.isRequired,
  })),
};

LessonCard.defaultProps = {
  cover: '',
  title: '',
  students: [],
};

export default LessonCard;