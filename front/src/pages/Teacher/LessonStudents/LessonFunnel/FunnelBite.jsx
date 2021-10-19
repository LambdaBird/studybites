import T from 'prop-types';

import DistributionSpark from '@sb-ui/components/atoms/DistributionSpark';

import BiteDescription from './BiteDescription';
import { Bite } from './types';
import * as S from './LessonFunnel.styled';

const FunnelBite = ({ bite, sparkTimeScale, bitesNumber, isFirst, isLast }) => {
  const { id, landed, prevLanded, blocks, replySeries, initialLanded } = bite;

  const diffNumber = ((prevLanded - landed) / prevLanded) * 100;
  const studentsChangePercent = !!diffNumber && `-${diffNumber.toFixed(2)}%`;

  return (
    <>
      <S.BiteBarWrapper>
        <S.BiteBar
          title={landed}
          prevLanded={prevLanded}
          landed={landed}
          initialLanded={initialLanded}
          whole={bitesNumber}
          number={id}
        >
          <S.LandedNumber>{landed}</S.LandedNumber>
          <div>&nbsp;</div>
        </S.BiteBar>
      </S.BiteBarWrapper>
      <S.DiffNumber value={diffNumber || 0}>
        {!isFirst && studentsChangePercent}
      </S.DiffNumber>
      <div />
      <BiteDescription isStart={isFirst} isFinish={isLast} blocks={blocks} />
      <DistributionSpark
        replySeries={replySeries}
        timeCohortScale={sparkTimeScale}
        isHeader={isFirst}
      />
    </>
  );
};

FunnelBite.propTypes = {
  sparkTimeScale: T.func.isRequired,
  bitesNumber: T.number.isRequired,
  isFirst: T.bool.isRequired,
  isLast: T.bool.isRequired,
  bite: T.shape(Bite).isRequired,
};

export default FunnelBite;
