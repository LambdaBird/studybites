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
