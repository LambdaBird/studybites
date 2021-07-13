import * as T from 'prop-types';

import BlockElement from '@sb-ui/pages/User/LessonPage/BlockElement';

import { ChunkWrapper } from './styled';

const LearnChunk = ({ chunk }) => {
  const staticBlocks = chunk.slice(0, -1);
  const interactiveBlock = chunk[chunk.length - 1]

  return (
    <>
      <ChunkWrapper>
        {staticBlocks.map((block) => (
          <BlockElement key={block.id} element={block} />
        ))}
      </ChunkWrapper>
      <BlockElement element={interactiveBlock} />
    </>
  );
}

LearnChunk.propTypes = {
  chunk: T.arrayOf(T.object).isRequired,
};

export default LearnChunk;