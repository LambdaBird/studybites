import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

import { ExclamationCircleOutlined } from '@sb-ui/components/Icons';
import { Statuses } from '@sb-ui/pages/Teacher/Home/Dashboard/constants';
import { queryClient } from '@sb-ui/query';
import { patchCoursesStatus } from '@sb-ui/utils/api/v1/courses-management';
import { patchLessonStatus } from '@sb-ui/utils/api/v1/teacher';
import {
  TEACHER_COURSES_BASE_KEY,
  TEACHER_LESSON_BASE_KEY,
  TEACHER_LESSONS_BASE_KEY,
} from '@sb-ui/utils/queries';

export const useLessonStatus = ({ id }) => {
  const { t } = useTranslation('teacher');

  const { mutateAsync: updateCoursesStatuses } = useMutation(
    patchCoursesStatus,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(TEACHER_COURSES_BASE_KEY);
      },
    },
  );

  const updateLessonStatusMutation = useMutation(patchLessonStatus, {
    onSuccess: ({ status: statusToChange }) => {
      queryClient.invalidateQueries(TEACHER_LESSON_BASE_KEY);
      queryClient.invalidateQueries(TEACHER_LESSONS_BASE_KEY);
      queryClient.invalidateQueries(TEACHER_COURSES_BASE_KEY);
      if (
        statusToChange !== Statuses.DRAFT &&
        statusToChange !== Statuses.ARCHIVED
      ) {
        Modal.success({
          width: 480,
          title: t('lesson_edit.publish_modal.title'),
          okText: t('lesson_edit.publish_modal.ok'),
        });
      }
    },
    onError: (error) => {
      if (error.response?.data?.message !== 'errors.courses_restricted') {
        return;
      }

      const { courses, status: statusToChange } =
        error.response.data.payload || {};

      const nonDraftOrArchivedCourses = courses?.filter(
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
        async onOk() {
          await updateCoursesStatuses({
            courses,
            status: statusToChange,
          });
          updateLessonStatusMutation.mutate({
            id,
            status: statusToChange,
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
