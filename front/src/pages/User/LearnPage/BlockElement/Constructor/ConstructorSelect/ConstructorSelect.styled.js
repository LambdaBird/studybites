import styled from 'styled-components';
import { RightOutlined as RightOutlinedAntd } from '@ant-design/icons';

import variables from '@sb-ui/theme/variables';

// px sizes
export const HEIGHT_GAP = 8;
export const HEIGHT_WORD = 22;
export const BORDER = 1;
export const HEIGHT_GAP_SELECTED = 24;

export const Textarea = styled.textarea.attrs({
  rows: 2,
})`
  flex: 1;
  outline: none;
  border: none;
  word-break: break-word;
  resize: none;
`;

export const RightOutlined = styled(RightOutlinedAntd)`
  color: ${variables['button-send-color']};
`;

export const LineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0 2rem 0;
`;

export const Line = styled.div`
  width: 100%;
  height: 2rem;
  border-bottom: 1px solid
    ${variables['lesson-block-constructor-word-underline']};
`;

export const WordsWrapperSelected = styled.div`
  gap: ${HEIGHT_GAP_SELECTED}px 0.5rem;
  display: flex;
  flex-wrap: wrap;
`;

export const WordsWrapper = styled.div`
  gap: ${HEIGHT_GAP}px 0.5rem;
  display: flex;
  flex-wrap: wrap;
`;

export const Word = styled.div`
  display: inline-block;
  border-radius: 2px;
  border: ${BORDER}px solid ${variables['border-color-base']};
  background-color: ${(props) =>
    props.selected
      ? variables['lesson-block-constructor-word-background']
      : variables['background-color-light']};
  padding: 0 1rem;
  color: ${(props) =>
    props.selected
      ? variables['lesson-block-constructor-word-background']
      : 'inherit'};
  cursor: ${(props) => (props.selected ? 'default' : 'pointer')};
  user-select: none;
`;

export const WordDisabled = styled(Word)`
  cursor: default;
`;
