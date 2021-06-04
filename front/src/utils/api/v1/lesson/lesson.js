import { sleep } from '../../../utils';

const getLessonsMocked = async ({ offset, limit, search }) => {
  let data = new Array(100).fill(1).map((x, i) => ({
    id: i,
    name: `Lesson${i + 1}`,
    description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci dignissimos eaque, hic magnam nemo officiis porro quidem recusandae repellat repellendus.`,
    author: `John Doe${i + 1}`,
  }));
  if (search) {
    data = data.filter(
      (x) => x.name.includes(search) || x.author.includes(search),
    );
  }
  await sleep(500);
  return {
    status: 200,
    data: {
      total: data.length,
      data: data.slice(offset, offset + limit),
    },
  };
};

export const getLessons = async (paramsData) => {
  try {
    /*
    const { status, data } = await axios.get(`${PATH}/`, {
      params: paramsData,
    });
     */
    return await getLessonsMocked(paramsData);
  } catch (e) {
    const { status, data } = e.response;
    return {
      status,
      data,
    };
  }
};
