export const PAGE_SIZE = 10;

export const itemPerPage = [...new Array(PAGE_SIZE)].map((_, index) => ({
  id: `skeleton ${index}`,
}));
