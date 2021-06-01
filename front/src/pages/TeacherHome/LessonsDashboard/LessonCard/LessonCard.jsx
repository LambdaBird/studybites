import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Typography, Space, Avatar, Tooltip } from 'antd';
import * as S from './LessonCard.styled';

const { Title, Text } = Typography;

const LessonCard = ({ cover, title, students, status }) => {
  const { t } = useTranslation();

  return (
    <S.Wrapper justify="center" align="middle">   
      <S.ImageCol span={8}>
        {status === 'Draft'
          ? (<S.ImageBlock>
              <S.CardBadge>
                <Text>
                  {status}
                </Text>
              </S.CardBadge>
            </S.ImageBlock>)
          : null}   
        <S.CardImage src={cover} />
      </S.ImageCol>
      <S.CardDescription span={16}>
        <S.CardText>
          <Title level={4}>{title}</Title>
          {!students.length ? (
            <Text type="secondary">
              {t('lesson_dashboard.card.no_students')}
            </Text>
          ) : (
            <Space>
              <Avatar.Group maxCount={3}>
                {students.map((el) => (
                  <Tooltip key={el.id} title={el.name} placement="top">
                    <Avatar src={el.avatar} />
                  </Tooltip>
                ))}
              </Avatar.Group>
              <Text type="secondary">
                {students.length} {t('lesson_dashboard.card.students')}
              </Text>
            </Space>
          )}
        </S.CardText>
        <S.CardButton>{t('lesson_dashboard.card.edit')}</S.CardButton>
      </S.CardDescription>
    </S.Wrapper>
  );
};

LessonCard.propTypes = {
  cover: PropTypes.string,
  title: PropTypes.string,
  status: PropTypes.string,
  students: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
};

LessonCard.defaultProps = {
  cover: '',
  title: '',
  students: [],
  status: '',
};

export default LessonCard;
