import * as S from './ConstructorSelect.styled';

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
        return <S.WordDisabled key={`${word}-${key}`}>{word}</S.WordDisabled>;
      });
  }

  return selectedWordsId.map((wordId) => {
    const { id, value } = words.find((x) => x.id === wordId);
    return (
      <S.Word key={id} onClick={() => handleWordRemoveClick(wordId)}>
        {value}
      </S.Word>
    );
  });
};

export default SelectedWords;
