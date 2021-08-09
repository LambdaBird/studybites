import * as T from 'prop-types';
import { useEffect, useRef } from 'react';

import BlockElement from '@sb-ui/pages/User/LearnPage/BlockElement';

import * as S from './LearnPage.styled';

const LearnChunk = ({ chunk }) => {
  const staticBlocks = chunk?.slice(0, -1);
  const interactiveBlock = chunk?.[chunk.length - 1];

  const wrapperRef = useRef(null);

  useEffect(() => {
    wrapperRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      {staticBlocks?.length > 0 && (
        <S.ChunkWrapper ref={wrapperRef}>
          {staticBlocks.map((block) => (
            <BlockElement key={block.blockId} element={block} />
          ))}
        </S.ChunkWrapper>
      )}

      <BlockElement element={interactiveBlock} />
    </>
  );
};

LearnChunk.propTypes = {
  chunk: T.arrayOf(T.object).isRequired,
};

export default LearnChunk;
