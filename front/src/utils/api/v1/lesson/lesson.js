// import axios from 'axios';

// const PATH = '/api/v1/lesson';

const FakeDataNumber = 100;
const statusSuccess = 200;

export const getLessons = async ({
  offset,
  pageLimit,
  searchReq,
  filterReq,
}) => {
  try {
    // const { status, data } = await axios.post(`${PATH}/maintain`, {
    // });
    // return { status, data };
    let fakeData = [...new Array(FakeDataNumber)].map((el, index) => {
      const statusArr = ['Draft', 'Public', 'Private', 'Archived'];
      return {
        id: index,
        name: `Lesson ${index}`,
        description: `Lesson ${index}`,
        status: statusArr[Math.floor(Math.random() * statusArr.length)],
        cover:
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        students: [...new Array(FakeDataNumber)].map((e, i) => ({
          id: `student ${i}`,
          name: `Student ${i}`,
          avatar:
            'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        })),
      };
    });

    if (searchReq) {
      fakeData = fakeData.filter((el) => el.name.includes(searchReq));
    }

    if (filterReq) {
      fakeData = fakeData.filter((el) => el.status.includes(filterReq));
    }

    const totalPages = fakeData.length;

    const pageData = fakeData.slice(offset, pageLimit + offset);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    await sleep(1000);

    return {
      status: statusSuccess,
      data: {
        data: pageData,
        total: totalPages,
      },
    };
  } catch (e) {
    const { status, data } = e.response;
    return {
      status,
      data,
    };
  }
};
