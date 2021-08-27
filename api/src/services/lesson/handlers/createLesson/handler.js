export async function createLessonHandler({
  body: { lesson, blocks, keywords },
  user: { id: userId },
}) {
  const {
    models: {
      Lesson,
      UserRole,
      Block,
      LessonBlockStructure,
      Keyword,
      ResourceKeyword,
    },
    config: {
      globals: { resources },
    },
  } = this;

  try {
    const data = await Lesson.transaction(async (trx) => {
      const lessonData = await Lesson.createLesson({ trx, lesson });
      await UserRole.addMaintainer({ trx, userId, resourceId: lessonData.id });

      if (keywords) {
        await Keyword.createMany({ trx, keywords });
        const keywordsIds = await Keyword.getId({ trx, keywords });
        const resourceKeywords = keywordsIds.map((keyword) => ({
          keywordId: keyword.keywordId,
          resourceId: lessonData.id,
          resourceType: resources.LESSON.name,
        }));
        await ResourceKeyword.createMany({ trx, resourceKeywords });
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
