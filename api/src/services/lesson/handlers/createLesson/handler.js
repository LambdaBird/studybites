export async function createLessonHandler({
  body: { lesson, blocks },
  user: { id: userId },
}) {
  const {
    models: { Lesson, UserRole, Block, LessonBlockStructure },
  } = this;

  try {
    const data = await Lesson.transaction(async (trx) => {
      const lessonData = await Lesson.query(trx).insert(lesson).returning('*');
      await UserRole.addMaintainer({ trx, userId, resourceId: lessonData.id });

      if (blocks.length) {
        const blocksData = await Block.query(trx).insert(blocks).returning('*');
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
