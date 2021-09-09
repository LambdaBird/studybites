import T from 'prop-types';

import FunnelBite from './FunnelBite';
import { Bite } from './types';
import useFunnelScales from './useFunnelScales';
import * as S from './LessonFunnel.styled';

const LessonFunnel = ({ bites }) => {
  const { sparkTimeScale } = useFunnelScales(bites);
  const bitesNumber = bites.length;

  return (
    <S.FunnelWrapper>
      {bites.map((bite, index) => (
        <FunnelBite
          key={bite.id}
          bite={bite}
          sparkTimeScale={sparkTimeScale}
          bitesNumber={bitesNumber}
          isLast={bitesNumber === index + 1}
          isFirst={!index}
        />
      ))}
    </S.FunnelWrapper>
  );
};

LessonFunnel.propTypes = {
  bites: T.arrayOf(T.shape(Bite)).isRequired,
};

export default LessonFunnel;
