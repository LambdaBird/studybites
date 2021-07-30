import { v4 } from 'uuid';
import { BadRequestError } from '../../../../validation/errors';
import { INVALID_BLOCK_CONTENT } from '../../constants';

const verifyImageData = (blocks, MAX_LENGTH = 5000) => {
  return blocks
    .filter((block) => block.type === 'image')
    .some((block) => block?.content?.data?.url?.length > MAX_LENGTH);
};

const MAX_IMAGE_LENGTH = 4_000_000;

export async function updateLessonHandler({
  body: { lesson, blocks },
  params: { lessonId },
}) {
  const {
    knex,
    models: { Lesson, Block, LessonBlockStructure },
  } = this;

  if (verifyImageData(blocks, MAX_IMAGE_LENGTH)) {
    throw new BadRequestError(INVALID_BLOCK_CONTENT);
  }

  try {
    const data = await Lesson.transaction(async (trx) => {
      let lessonData;

      if (lesson) {
        lessonData = await Lesson.updateLesson({ trx, lessonId, lesson });
      } else {
        lessonData = await Lesson.query(trx).findById(lessonId);
      }

      if (blocks) {
        const { values } = await Block.getRevisions({ trx, knex });

        const blocksToInsert = [];

        for (let i = 0, n = blocks.length; i < n; i += 1) {
          const { revision, blockId } = blocks[i];

          if (revision && !blockId) {
            // eslint-disable-next-line no-param-reassign
            blocks[i].blockId = v4();
            blocksToInsert.push(blocks[i]);
          }

          if (revision && blockId) {
            if (values[blockId] && !values[blockId].includes(revision)) {
              blocksToInsert.push(blocks[i]);
            }
          }
        }

        if (blocksToInsert.length) {
          const blocksData = await Block.createBlocks({
            trx,
            blocks: blocksToInsert,
          });
          lessonData.blocks = blocksData;
        }

        await LessonBlockStructure.query(trx).delete().where({ lessonId });
        await LessonBlockStructure.insertBlocks({
          trx,
          blocks,
          lessonId,
        });
      }

      return lessonData;
    });

    return { lesson: data };
  } catch (err) {
    throw new Error(err);
  }
}
