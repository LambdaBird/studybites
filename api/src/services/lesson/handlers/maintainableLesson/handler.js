export async function maintainableLessonHandler({ params: { lessonId } }) {
  const {
    models: { Lesson, LessonBlockStructure, UserRole, ResourceKeyword },
  } = this;

  const lesson = await Lesson.findById({ lessonId });
  const { count: studentsCount } = await UserRole.getLessonStudentsCount({
    lessonId,
  });

  lesson.studentsCount = studentsCount;
  lesson.blocks = await LessonBlockStructure.getAllBlocks({ lessonId });

  const keywords = await ResourceKeyword.getLessonKeywords({ lessonId });
  return { lesson, keywords };
}
