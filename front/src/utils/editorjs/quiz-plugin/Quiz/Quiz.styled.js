import styled from 'styled-components';

export const Checkbox = styled.span.attrs((props) => ({
  className: props.correct
    ? 'quiz-tool__item-checkbox quiz-tool__item--checked'
    : 'quiz-tool__item-checkbox',
}))``;

export const Wrapper = styled.div.attrs({
  className: 'quiz-tool__wrapper',
})``;

export const Input = styled.div.attrs({
  className: 'cdx-input',
  contentEditable: true,
})``;

export const ItemsWrapper = styled.div.attrs({
  className: 'quiz-tool__items--wrapper',
})``;

export const Item = styled.div.attrs({
  className: 'quiz-tool__item',
})``;

export const ItemInput = styled.div.attrs({
  className: 'quiz-tool__item-text',
  contentEditable: true,
})``;
