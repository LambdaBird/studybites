import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef } from 'react';

import SelectedWords from './SelectedWords';
import * as S from './ConstructorSelect.styled';
import {
  BORDER,
  HEIGHT_GAP,
  HEIGHT_GAP_SELECTED,
  HEIGHT_WORD,
} from './ConstructorSelect.styled';

const ConstructorSelect = ({
  words,
  setWords = () => {},
  additionalLines,
  setAdditionalLines = () => {},
  selectedWordsId,
  setSelectedWordsId = () => {},
  disabled = false,
}) => {
  const wordsRef = useRef();
  const selectedWordsRef = useRef();

  const calculateCountLines = useCallback(() => {
    const currentWords = wordsRef.current || selectedWordsRef.current;
    const heightGap = wordsRef.current ? HEIGHT_GAP : HEIGHT_GAP_SELECTED;

    return (
      Math.ceil(
        (currentWords?.clientHeight + heightGap) /
          (HEIGHT_WORD + 2 * BORDER + heightGap),
      ) || 1
    );
  }, []);

  const setWordSelected = useCallback(
    (wordId, selected) =>
      setWords((prev) => {
        const wordsSlice = prev.slice();
        const word = wordsSlice.find((x) => x.id === wordId);
        word.selected = selected;
        return wordsSlice;
      }),
    [setWords],
  );

  const handleWordClick = useCallback(
    ({ id: wordId, selected }) => {
      if (!selected) {
        setWordSelected(wordId, true);
        setSelectedWordsId((prev) => [...prev, wordId]);
      }
    },
    [setSelectedWordsId, setWordSelected],
  );

  const handleWordRemoveClick = useCallback(
    (wordId) => {
      setSelectedWordsId((prev) => prev.filter((x) => x !== wordId));
      setWordSelected(wordId, false);
    },
    [setSelectedWordsId, setWordSelected],
  );

  const resizeHandler = useCallback(() => {
    setAdditionalLines([...new Array(calculateCountLines() - 1).keys()]);
  }, [calculateCountLines, setAdditionalLines]);

  useEffect(() => {
    resizeHandler();
    if (wordsRef.current || selectedWordsRef.current) {
      window.addEventListener('resize', resizeHandler);
    }
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [resizeHandler]);

  useEffect(() => {
    resizeHandler();
  }, [disabled, resizeHandler]);

  return (
    <>
      <S.LineWrapper>
        <S.Line>
          <S.WordsWrapperSelected ref={selectedWordsRef}>
            <SelectedWords
              words={words}
              selectedWordsId={selectedWordsId}
              handleWordRemoveClick={handleWordRemoveClick}
              disabled={disabled}
            />
          </S.WordsWrapperSelected>
        </S.Line>
        {additionalLines?.map((line) => (
          <S.Line key={line} />
        ))}
      </S.LineWrapper>
      {!disabled && (
        <S.WordsWrapper ref={wordsRef}>
          {words.map(({ value, selected, id }) => (
            <S.Word
              key={id}
              onClick={() => handleWordClick({ value, selected, id })}
              selected={selected}
            >
              {value}
            </S.Word>
          ))}
        </S.WordsWrapper>
      )}
    </>
  );
};

ConstructorSelect.propTypes = {
  words: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        id: PropTypes.number,
        selected: PropTypes.bool,
      }),
    ),
    PropTypes.arrayOf(PropTypes.string),
  ]),
  setWords: PropTypes.func,
  additionalLines: PropTypes.arrayOf(PropTypes.number),
  setAdditionalLines: PropTypes.func,
  selectedWordsId: PropTypes.arrayOf(PropTypes.number),
  setSelectedWordsId: PropTypes.func,
  disabled: PropTypes.bool,
};

export default ConstructorSelect;
