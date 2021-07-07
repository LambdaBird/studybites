import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Avatar, Dropdown, Menu, Space, Tooltip, Typography } from 'antd';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import { EllipsisOutlined } from '@ant-design/icons';
import lesson from '@sb-ui/resources/img/lesson.svg';
import { putLesson } from '@sb-ui/utils/api/v1/teacher';
import { queryClient } from '@sb-ui/query';
import { LESSONS_EDIT } from '@sb-ui/utils/paths';
import { TEACHER_LESSONS_BASE_KEY } from '@sb-ui/utils/queries';
import { Statuses } from '@sb-ui/pages/Teacher/Home/LessonsDashboard/constants';
import * as S from './Teacher.styled';

const { Text } = Typography;

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

const Teacher = ({ title, id, students, status }) => {
  const history = useHistory();
  const { t } = useTranslation('teacher');
  const updateLessonMutation = useMutation(putLesson, {
    onSuccess: () => {
      queryClient.invalidateQueries(TEACHER_LESSONS_BASE_KEY);
    },
  });

  const handleMenuClick = ({ key }) => {
    if (key === 'archiveLesson') {
      updateLessonMutation.mutate({
        lesson: { id, status: Statuses.ARCHIVED },
      });
    }
    if (key === 'publishLesson') {
      updateLessonMutation.mutate({ lesson: { id, status: Statuses.PUBLIC } });
    }
    if (key === 'restoreLesson') {
      updateLessonMutation.mutate({ lesson: { id, status: Statuses.DRAFT } });
    }
    if (key === 'draftLesson') {
      updateLessonMutation.mutate({ lesson: { id, status: Statuses.DRAFT } });
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
          <S.TitleEllipsis
            ellipsis={{
              tooltip: true,
            }}
            level={4}
          >
            {title}
          </S.TitleEllipsis>
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

Teacher.propTypes = {
  students: PropTypes.arrayOf(PropTypes.shape({})),
  status: PropTypes.oneOf(Object.values(Statuses)).isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

Teacher.defaultProps = {
  students: [],
};

export default Teacher;
