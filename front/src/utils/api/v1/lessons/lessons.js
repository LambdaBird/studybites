// eslint-disable-next-line no-unused-vars
import api from '@sb-ui/utils/api';

// eslint-disable-next-line no-unused-vars
const PATH = '/api/v1/lessons';

const TEST_BLOCKS = 4 * 5;

const generateBlocks = (len) =>
  new Array(len).fill(1).map((_, i) => {
    const typeCheck = (i + 1) % 4 === 0 || i === len - 1;
    return {
      blockId: `693c19e-${i}`,
      content: {
        id: `sXs-Q-${i}`,
        type: typeCheck ? 'next' : 'paragraph',
        data: {
          text: typeCheck ? undefined : `Text ${i}`,
        },
      },
      type: typeCheck ? 'next' : 'paragraph',
      revision: `72dab14d08bfc9af35c6bdf69${i + 1}`,
      createdAt: '2021-06-17T11:11:45.217Z',
      updatedAt: '2021-06-17T11:11:45.217Z',
    };
  });

const generateLesson = (id) => ({
  blocks: generateBlocks(TEST_BLOCKS),
  authors: [
    {
      id: 2,
      firstName: 'George',
      lastName: 'Bakman',
    },
  ],
  description: 'Just text',
  id: parseInt(id, 10),
  name: `Hello guys${id}`,
  status: 'Public',
  createdAt: '2021-06-22T07:18:38.594Z',
  updatedAt: '2021-06-22T07:18:38.594Z',
});

export const CURRENT_MOCK_BLOCK_TEST = 0;

export const getLessons = async ({ queryKey }) => {
  const [, id] = queryKey;
  /* const { data } = await api.get(`${PATH}/${id}`, {
    params: paramsData,
  }); */
  let data = generateLesson(id);
  data = {
    ...data,
    blocks: data.blocks.slice(0, CURRENT_MOCK_BLOCK_TEST),
  };
  return { data };
};

export const postLessons = async (_blockTest) => {
  /*
  const { data } = await api.post(`${PATH}/${id}/learn`, {
    params: paramsData,
  });
  */
  const data = generateBlocks(TEST_BLOCKS).slice(_blockTest, _blockTest + 4);
  return { data };
};
