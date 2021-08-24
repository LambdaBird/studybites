import * as S from './Select.styled';

const SelectedWords = ({
  selectedWordsId,
  words,
  disabled,
  handleWordRemoveClick,
}) => {
  if (disabled) {
    return words
      ?.map((word, index) => ({ word, key: index }))
      ?.map(({ word, key }) => {
        return <S.Word key={`${word}-${key}`}>{word}</S.Word>;
      });
  }

  return selectedWordsId.map((wordId) => {
    const { id, value } = words.find((x) => x.id === wordId);
    return (
      <S.Word
        key={id}
        onClick={disabled ? null : () => handleWordRemoveClick(wordId)}
      >
        {value}
      </S.Word>
    );
  });
};

export default SelectedWords;
