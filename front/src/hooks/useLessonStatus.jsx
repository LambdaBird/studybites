import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { Statuses } from '@sb-ui/pages/Teacher/Home/Dashboard/constants';
import { queryClient } from '@sb-ui/query';
import { postStatus } from '@sb-ui/utils/api/v1/status-managemenet';
import {
  TEACHER_COURSES_BASE_KEY,
  TEACHER_LESSON_BASE_KEY,
  TEACHER_LESSONS_BASE_KEY,
} from '@sb-ui/utils/queries';

export const useLessonStatus = ({ id }) => {
  const { t } = useTranslation('teacher');
  const updateLessonStatusMutation = useMutation(postStatus, {
    onSuccess: ({ status: statusToChange, update, courses }) => {
      if (update) {
        queryClient.invalidateQueries(TEACHER_LESSON_BASE_KEY);
        queryClient.invalidateQueries(TEACHER_LESSONS_BASE_KEY);
        queryClient.invalidateQueries(TEACHER_COURSES_BASE_KEY);
        if (statusToChange !== Statuses.DRAFT) {
          Modal.success({
            width: 480,
            title: t('lesson_edit.publish_modal.title'),
            okText: t('lesson_edit.publish_modal.ok'),
          });
        }
        return;
      }

      const nonDraftOrArchivedCourses = courses.filter(
        (course) => course.status !== statusToChange,
      );
      Modal.confirm({
        title: t('lesson_dashboard.status_modal.title'),
        icon: <ExclamationCircleOutlined />,
        content: t('lesson_dashboard.status_modal.content', {
          coursesCount: nonDraftOrArchivedCourses.length,
        }),
        okText: t('lesson_dashboard.status_modal.ok'),
        cancelText: t('lesson_dashboard.status_modal.cancel'),
        onOk() {
          updateLessonStatusMutation.mutate({
            id,
            status: statusToChange,
            force: true,
          });
        },
        onCancel() {},
      });
    },
  });

  return {
    updateLessonStatusMutation,
    isUpdateInProgress: updateLessonStatusMutation.isLoading,
  };
};
