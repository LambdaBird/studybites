import { Skeleton } from 'antd';
import T from 'prop-types';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

import {
  getLesson,
  getTeacherLessonStudents,
} from '@sb-ui/utils/api/v1/teacher';
import {
  TEACHER_LESSON_BASE_KEY,
  TEACHER_LESSON_STUDENTS_BASE_KEY,
} from '@sb-ui/utils/queries';

import LessonFunnel from './LessonFunnel';

// TODO: take from shared place
export const staticTypesBlocks = ['paragraph', 'list', 'header', 'table'];
export const interactiveTypesBlocks = [
  'next',
  'next',
  'closedQuestion',
  'quiz',
];

const FunnelContainer = ({ lessonId }) => {
  const {
    data: students,
    isLoading: isStudentsLoading,
    // isPreviousData: isStudentsPreviousData,
  } = useQuery(
    [TEACHER_LESSON_STUDENTS_BASE_KEY, { lessonId }],
    getTeacherLessonStudents,
    {
      keepPreviousData: true,
    },
  );

  const {
    data: lessonData,
    isLoading: isLessonLoading,
    // isPreviousData: isLessonPreviousData,
  } = useQuery([TEACHER_LESSON_BASE_KEY, { id: lessonId }], getLesson, {
    keepPreviousData: true,
  });

  const bites = useMemo(() => {
    if (isStudentsLoading || isLessonLoading || !lessonData) {
      return [];
    }

    const initialLanded = students.total;

    const chunks = lessonData.lesson.blocks.reduce(
      (list, block) => {
        list[list.length - 1].push(block);

        if (interactiveTypesBlocks.includes(block.type)) {
          list.push([]);
        }

        return list;
      },
      [[]],
    );

    const chunkBites = [
      {
        id: 1,
        landed: initialLanded,
        prevLanded: initialLanded,
        initialLanded,
        blocks: null,
        replySeries: null,
      },
      ...chunks,
    ]
      .map((bite, index) => {
        if (!index) {
          return bite;
        }

        const interactiveBlock = bite[bite.length - 1];

        const landedStudents = students.students.filter((student) => {
          const theResult = student.results.find(
            (result) => result.revision === interactiveBlock.revision,
          );

          return !!theResult;
        });

        return {
          id: index + 1,
          initialLanded,
          landed: landedStudents.length,
          blocks: bite.map((block) => block.type),
          replySeries: landedStudents.map((student) => {
            const theResultIndex = student.results.findIndex(
              (result) => result.revision === interactiveBlock.revision,
            );

            return (
              new Date(student.results[theResultIndex].createdAt) -
              new Date(student.results[theResultIndex - 1].createdAt)
            );
          }),
        };
      })
      .map((bite, index, list) => {
        if (!index) {
          return bite;
        }

        return {
          ...bite,
          prevLanded: list[index - 1].landed,
        };
      });

    return chunkBites;
  }, [students, lessonData, isStudentsLoading, isLessonLoading]);

  const isLoading = isStudentsLoading || isLessonLoading;

  return (
    <div style={{ width: '900px', margin: '0 auto' }}>
      {isLoading ? (
        <Skeleton loading={isLoading} paragraph={{ rows: 2 }} active />
      ) : (
        <LessonFunnel bites={bites} />
      )}
    </div>
  );
};

FunnelContainer.propTypes = {
  lessonId: T.string.isRequired,
};

export default FunnelContainer;
