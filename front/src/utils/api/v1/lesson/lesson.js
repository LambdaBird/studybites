// import axios from 'axios';

// const PATH = '/api/v1/lesson';

const FakeDataNumber = 20;
const statusSuccess = 200;

export const getLessons = async () => {
  try {
    // const { status, data } = await axios.post(`${PATH}/maintain`, {
    // });
    // return { status, data };
    const fakeData = [...new Array(FakeDataNumber)].map((el, index) => {
      const statusArr = ['Draft', 'Public', 'Private', 'Archived'];
      return {
        id: index,
        name: `Lesson ${index}`,
        description: `Lesson ${index}`,
        status: statusArr[Math.floor(Math.random() * statusArr.length)],
        cover: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      };
    });

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    await sleep(1000);

    return { status: statusSuccess, data: fakeData };
  } catch (e) {
    const { status, data } = e.response;
    return {
      status,
      data,
    };
  }
};
