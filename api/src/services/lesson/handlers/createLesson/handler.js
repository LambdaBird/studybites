import { v4 } from 'uuid';

export async function createLessonHandler({
  body: { lesson, blocks },
  user: { id: userId },
}) {
  const {
    config,
    models: { Lesson, UserRole, Block, LessonBlockStructure },
  } = this;

  try {
    const data = await Lesson.transaction(async (trx) => {
      const lessonData = await Lesson.query(trx).insert(lesson).returning('*');

      await UserRole.query(trx)
        .insert({
          userId,
          roleId: config.roles.MAINTAINER.id,
          resourceType: config.resources.LESSON,
          resourceId: lessonData.id,
        })
        .returning('*');

      if (blocks && blocks.length) {
        const blocksData = await Block.query(trx).insert(blocks).returning('*');

        const blockStructure = [];

        for (let i = 0, n = blocksData.length; i < n; i += 1) {
          blockStructure.push({
            id: v4(),
            lessonId: lessonData.id,
            blockId: blocksData[i].blockId,
          });
        }

        for (let i = 0, n = blockStructure.length; i < n; i += 1) {
          blockStructure[i].parentId = !i ? null : blockStructure[i - 1].id;
          blockStructure[i].childId =
            i === n - 1 ? null : blockStructure[i + 1].id;
        }

        await LessonBlockStructure.query(trx).insert(blockStructure);
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
