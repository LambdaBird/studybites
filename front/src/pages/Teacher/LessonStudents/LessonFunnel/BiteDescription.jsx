import T from 'prop-types';
import { useTranslation } from 'react-i18next';

import { BiteBlocks } from './types';
import useBlocksIcons from './useBlocksIcons';
import * as S from './LessonFunnel.styled';

const finishedKey = 'teacher:lesson_funnel.finish_bite';
const startedKey = 'teacher:lesson_funnel.start_bite';

const BiteDescription = ({ isStart, isFinish, blocks }) => {
  const blockIconslist = useBlocksIcons({ blocks });
  const { t } = useTranslation();

  const titleKey = isFinish ? finishedKey : startedKey;

  return (
    <S.TypeWrapper>
      {isStart || isFinish ? (
        <S.LessonStarted>{t(titleKey)}</S.LessonStarted>
      ) : (
        blockIconslist.map(({ key, title, icon }) => (
          <div key={key} title={title}>
            {icon}
          </div>
        ))
      )}
    </S.TypeWrapper>
  );
};

BiteDescription.propTypes = {
  isStart: T.bool.isRequired,
  isFinish: T.bool.isRequired,
  blocks: BiteBlocks,
};

export default BiteDescription;
