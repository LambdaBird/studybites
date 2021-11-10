export const isBackspaceValid = (event, value) =>
  event.code === 'Backspace' && value.trim().length === 0;

export const moveCaretToEnd = (element) => {
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
};

export const checkIsCellEmpty = (cell) =>
  cell?.innerText?.trim?.()?.length === 0;

export const deleteIfBackspace = ({
  event,
  api,
  element,
  elements,
  selectInCell,
}) => {
  const isCellEmpty = checkIsCellEmpty(element);
  const cells = elements;
  if (isCellEmpty) {
    const cellIndex = cells.findIndex((cell) => cell === element);
    if (cellIndex === 0 && cells.every(checkIsCellEmpty)) {
      api.blocks.delete();
      return;
    }
    const prevCell = cells[cellIndex - 1];
    if (prevCell) {
      event.preventDefault();
      event.stopPropagation();
      const prevEditable = selectInCell ? selectInCell(prevCell) : prevCell;
      prevEditable?.focus?.();
      moveCaretToEnd(prevEditable);
    }
  }
};
