import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Typography, Space, Avatar, Tooltip, Menu, Dropdown } from 'antd';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import { EllipsisOutlined } from '@ant-design/icons';
import lesson from '@sb-ui/resources/img/lesson.svg';
import { updateLessonStatus } from '@sb-ui/utils/api/v1/lesson';
import { queryClient } from '@sb-ui/query';
import { LESSONS_EDIT } from '@sb-ui/utils/paths';
import { TEACHER_LESSONS_BASE_KEY } from '@sb-ui/utils/queries';
import * as S from './LessonCard.styled';
import { Statuses } from '../constants';

const { Title, Text } = Typography;

const menuItems = {
  [Statuses.DRAFT]: [
    { key: 'publishLesson', labelKey: 'lesson_dashboard.menu.publish' },
    {
      key: 'archiveLesson',
      labelKey: 'lesson_dashboard.menu.archive',
      isDanger: true,
    },
  ],
  [Statuses.PUBLIC]: [
    { key: 'draftLesson', labelKey: 'lesson_dashboard.menu.draft' },
    {
      key: 'archiveLesson',
      labelKey: 'lesson_dashboard.menu.archive',
      isDanger: true,
    },
  ],
  [Statuses.ARCHIVED]: [
    { key: 'restoreLesson', labelKey: 'lesson_dashboard.menu.restore' },
  ],
};

const LessonCard = ({ title, id, students, status }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const updateLessonMutation = useMutation(updateLessonStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries(TEACHER_LESSONS_BASE_KEY);
    },
  });

  const handleMenuClick = ({ key }) => {
    if (key === 'archiveLesson') {
      updateLessonMutation.mutate({ id, status: Statuses.ARCHIVED });
    }
    if (key === 'publishLesson') {
      updateLessonMutation.mutate({ id, status: Statuses.PUBLIC });
    }
    if (key === 'restoreLesson') {
      updateLessonMutation.mutate({ id, status: Statuses.DRAFT });
    }
    if (key === 'draftLesson') {
      updateLessonMutation.mutate({ id, status: Statuses.DRAFT });
    }
  };

  const handleEdit = () => {
    history.push(LESSONS_EDIT.replace(':id', id));
  };

  const menu = () => (
    <Menu onClick={handleMenuClick}>
      {menuItems[status].map((menuItem) => (
        <Menu.Item danger={menuItem.isDanger} key={menuItem.key}>
          {t(menuItem.labelKey)}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <S.Wrapper justify="center" align="middle">
      <S.ImageCol span={8}>
        <S.BadgeWrapper>
          <S.CardBadge>
            <S.StatusText>
              {t(`lesson_dashboard.status.${status.toLocaleLowerCase()}`)}
            </S.StatusText>
          </S.CardBadge>
        </S.BadgeWrapper>
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
          <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
            <EllipsisOutlined />
          </Dropdown>
          <S.CardButton onClick={handleEdit}>
            {t('lesson_dashboard.card.edit')}
          </S.CardButton>
        </S.ActionsWrapper>
      </S.CardDescription>
    </S.Wrapper>
  );
};

LessonCard.propTypes = {
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  students: PropTypes.arrayOf(PropTypes.shape({})),
};

LessonCard.defaultProps = {
  students: [],
};

export default LessonCard;
