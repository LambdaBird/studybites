import T from 'prop-types';

import { BiteBlocks } from './types';
import useBlocksIcons from './useBlocksIcons';
import * as S from './LessonFunnel.styled';


const finishedKey = 'Email sumbited!';
const startedKey = 'Lesson start';

const BiteDescription = ({
  isStart,
  isFinish,
  blocks,
}) => {
  const blockIconslist = useBlocksIcons({ blocks });

  const titleKey = isFinish ? finishedKey : startedKey;

  return (
    <S.TypeWrapper>
      {isStart || isFinish 
        ? <S.LessonStarted>{titleKey}</S.LessonStarted>
        : blockIconslist.map(({ key, title, icon }) => <div key={key} title={title}>{icon}</div>)
      }
    </S.TypeWrapper>
  );
}

BiteDescription.propTypes = {
  isStart: T.bool.isRequired,
  isFinish: T.bool.isRequired,
  blocks: BiteBlocks,
};

export default BiteDescription;
