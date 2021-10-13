import { BLOCKS_TYPE } from '@sb-ui/pages/User/LearnPage/BlockElement/types';

export const SELF_STALE_TIME = 60_000; // 60 seconds

export default {
  interactiveBlocks: [
    BLOCKS_TYPE.NEXT,
    BLOCKS_TYPE.QUIZ,
    BLOCKS_TYPE.CLOSED_QUESTION,
    BLOCKS_TYPE.FILL_THE_GAP,
    BLOCKS_TYPE.BRICKS,
    BLOCKS_TYPE.MATCH,
    BLOCKS_TYPE.FINISH,
    BLOCKS_TYPE.GRADED_QUESTION,
  ],
};
