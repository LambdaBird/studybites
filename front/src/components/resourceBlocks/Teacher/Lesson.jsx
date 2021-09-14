import { Avatar, Dropdown, Menu, Space, Tooltip, Typography } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { EllipsisOutlined } from '@ant-design/icons';

import { StyledAvatar } from '@sb-ui/components/molecules/Header/Header.styled';
import { useLessonStatus } from '@sb-ui/hooks/useLessonStatus';
import {
  Statuses,
  statusesOptions,
} from '@sb-ui/pages/Teacher/Home/Dashboard/constants';
import DefaultLessonImage from '@sb-ui/resources/img/lesson.svg';
import { LESSONS_EDIT } from '@sb-ui/utils/paths';

import { TeacherPropTypes } from './types';
import * as S from './Lesson.styled';

const { Text } = Typography;

const menuItems = {
  [Statuses.DRAFT]: [
    { key: 'publishLesson', labelKey: 'lesson_dashboard.menu.publish' },
    {
      key: 'courseOnlyLesson',
      labelKey: 'lesson_dashboard.menu.course_only',
    },
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
  [Statuses.COURSE_ONLY]: [
    { key: 'draftLesson', labelKey: 'lesson_dashboard.menu.draft' },
    {
      key: 'archiveLesson',
      labelKey: 'lesson_dashboard.menu.archive',
      isDanger: true,
    },
  ],
};

const Lesson = ({ image, name, id, students: studentsData, status }) => {
  const history = useHistory();

  const { t } = useTranslation('teacher');
  const { updateLessonStatusMutation } = useLessonStatus({ id });

  const students = useMemo(
    () =>
      studentsData.map(({ id: studentId, firstName = '', lastName = '' }) => ({
        id: studentId,
        name: `${firstName} ${lastName}`,
      })),
    [studentsData],
  );

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'archiveLesson':
        updateLessonStatusMutation.mutate({ id, status: Statuses.ARCHIVED });
        break;
      case 'publishLesson':
        updateLessonStatusMutation.mutate({ id, status: Statuses.PUBLIC });
        break;
      case 'restoreLesson':
        updateLessonStatusMutation.mutate({ id, status: Statuses.DRAFT });
        break;
      case 'draftLesson':
        updateLessonStatusMutation.mutate({ id, status: Statuses.DRAFT });
        break;
      case 'courseOnlyLesson':
        updateLessonStatusMutation.mutate({ id, status: Statuses.COURSE_ONLY });
        break;
      default:
        break;
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

  const statusKey = useMemo(
    () =>
      statusesOptions
        .find((x) => x.value === status)
        ?.labelKey?.replace('status_select', 'status'),
    [status],
  );

  return (
    <S.Wrapper justify="center" align="middle">
      <S.ImageCol span={8}>
        <S.BadgeWrapper>
          <S.CardBadge>
            <S.StatusText>{t(statusKey)}</S.StatusText>
          </S.CardBadge>
        </S.BadgeWrapper>
        <S.CardImage
          fallback={DefaultLessonImage}
          src={image || DefaultLessonImage}
        />
      </S.ImageCol>
      <S.CardDescription span={16}>
        <S.CardText>
          <S.TitleEllipsis>{name}</S.TitleEllipsis>
          {!students.length ? (
            <Text type="secondary">
              {t('lesson_dashboard.card.no_students')}
            </Text>
          ) : (
            <Space>
              <Avatar.Group>
                {students.slice(0, 3).map((el) => (
                  <Tooltip key={el.id} title={el.name} placement="top">
                    {el.avatar ? (
                      <Avatar src={el.avatar} />
                    ) : (
                      <StyledAvatar>{el.name?.[0]}</StyledAvatar>
                    )}
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

Lesson.propTypes = TeacherPropTypes;

Lesson.defaultProps = {
  students: [],
};

export default Lesson;
