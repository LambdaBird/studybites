export async function createLessonHandler({
  body: { lesson, blocks, keywords },
  user: { id: userId },
}) {
  const {
    models: { Lesson, UserRole, Block, LessonBlockStructure, Keyword },
  } = this;

  try {
    const data = await Lesson.transaction(async (trx) => {
      const lessonData = await Lesson.createLesson({ trx, lesson });
      await UserRole.addMaintainer({ trx, userId, resourceId: lessonData.id });

      if (keywords) {
        await Keyword.createMany({ trx, keywords, resourceId: lessonData.id });
      }

      if (blocks.length) {
        blocks.forEach((block) => {
          if (!block.weight) {
            // eslint-disable-next-line no-param-reassign
            block.weight = 1.0;
          }
        });
        const blocksData = await Block.createBlocks({ trx, blocks });
        await LessonBlockStructure.insertBlocks({
          trx,
          blocks: blocksData,
          lessonId: lessonData.id,
        });
      }

      return lessonData;
    });

    data.blocks = await LessonBlockStructure.getAllBlocks({
      lessonId: data.id,
    });

    return { lesson: data };
  } catch (err) {
    throw new Error(err);
  }
}
