export async function maintainableLessonHandler({ params: { lessonId } }) {
  const {
    models: { Lesson, LessonBlockStructure, UserRole },
  } = this;

  const lesson = await Lesson.findById({ lessonId });
  const { count: studentsCount } = await UserRole.getLessonStudentsCount({
    lessonId,
  });

  lesson.studentsCount = studentsCount;
  lesson.blocks = await LessonBlockStructure.getAllBlocks({ lessonId });

  return { lesson };
}
