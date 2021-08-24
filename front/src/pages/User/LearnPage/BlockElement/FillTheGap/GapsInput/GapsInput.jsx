import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';

import * as S from './GapsInput.styled';

const GapsInput = ({ text, onData = () => {}, disabled, result }) => {
  const { t } = useTranslation('user');
  const chunks = useMemo(
    () => text?.split('{{ # }}').map((value, key) => ({ key, value })),
    [text],
  );

  const inputsRef = useRef(
    new Array(chunks.length - 1).fill(null).map(() => createRef()),
  );

  const getInputsValue = useCallback(
    () => inputsRef.current.map((x) => x?.current?.input?.value || ''),
    [],
  );

  const handleInputChange = () => {
    onData(getInputsValue());
  };

  useEffect(() => {
    onData(getInputsValue());
  }, [getInputsValue, onData]);

  return chunks.map(({ value: textValue, key }, index) => {
    if (index === chunks.length - 1) {
      return <span key={key}>{textValue}</span>;
    }

    if (result) {
      const { value, correct: correctValue } = result[index];
      return (
        <React.Fragment key={key}>
          <span>{textValue}</span>
          {correctValue ? (
            <S.CorrectSpan>{value}</S.CorrectSpan>
          ) : (
            <S.WrongSpan>{value}</S.WrongSpan>
          )}
        </React.Fragment>
      );
    }
    return (
      <S.Wrapper key={key}>
        <span>{textValue}</span>
        <S.Input
          placeholder={t('lesson.input_fill_gap.placeholder')}
          onChange={disabled ? null : handleInputChange}
          disabled={disabled}
          ref={inputsRef.current[index]}
        />
      </S.Wrapper>
    );
  });
};

export default GapsInput;
