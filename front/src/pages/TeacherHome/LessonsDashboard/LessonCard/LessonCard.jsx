import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Typography, Space, Avatar, Tooltip, Menu, Dropdown } from 'antd';
import { useMutation } from 'react-query';
import { EllipsisOutlined } from '@ant-design/icons';
import lesson from '@sb-ui/resources/img/lesson.svg';
import { archiveLesson } from '@sb-ui/utils/api/v1/lesson';
import { queryClient } from '@sb-ui/query';
import * as S from './LessonCard.styled';
import { TEACHER_LESSONS_BASE_KEY, Statuses } from '../constants';

const { Title, Text } = Typography;

const LessonCard = ({ title, id, students, status }) => {
  const { t } = useTranslation();
  const archiveMutation = useMutation(archiveLesson, {
    onSuccess: () => {
      queryClient.invalidateQueries(TEACHER_LESSONS_BASE_KEY);
    },
  });

  const handleMenuClick = ({ key }) => {
    if (key === 'archiveLesson') {
      archiveMutation.mutate({ id, status: Statuses.ARCHIVED });
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item danger key="archiveLesson">
        Archive lesson
      </Menu.Item>
    </Menu>
  );

  return (
    <S.Wrapper justify="center" align="middle">
      <S.ImageCol span={8}>
        {status === Statuses.DRAFT ? (
          <S.BadgeWrapper>
            <S.CardBadge>
              <S.StatusText>{status}</S.StatusText>
            </S.CardBadge>
          </S.BadgeWrapper>
        ) : null}
        {status === Statuses.ARCHIVED ? (
          <S.BadgeWrapper>
            <S.CardBadge>
              <S.StatusText>{status}</S.StatusText>
            </S.CardBadge>
          </S.BadgeWrapper>
        ) : null}
        <S.CardImage src={lesson} />
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
              <Avatar.Group>
                {students.slice(0, 3).map((el) => (
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
        <S.ActionsWrapper>
          {status !== Statuses.ARCHIVED ? (
            <Dropdown
              overlay={menu}
              trigger={['click']}
              placement="bottomRight"
            >
              <EllipsisOutlined />
            </Dropdown>
          ) : (
            <div />
          )}
          <S.CardButton>{t('lesson_dashboard.card.edit')}</S.CardButton>
        </S.ActionsWrapper>
      </S.CardDescription>
    </S.Wrapper>
  );
};

LessonCard.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  students: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  id: PropTypes.number.isRequired,
};

LessonCard.defaultProps = {
  students: [],
};

export default LessonCard;
