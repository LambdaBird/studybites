export const lessons = [
  {
    id: 100,
    name: 'Math',
    status: 'Public',
  },
  {
    id: 101,
    name: 'English',
    status: 'Public',
  },
  {
    id: 102,
    name: 'Biology',
    status: 'Public',
  },
  {
    id: 103,
    name: 'Literature',
    status: 'Public',
  },
  {
    id: 200,
    name: 'French',
    status: 'Public',
  },
];

export const blocks = [
  {
    block_id: 'aa34585e-130b-468c-be1a-5a8012f0d55c',
    content: {
      data: 'paragraph text',
    },
    type: 'paragraph',
    revision: '9f8ef6dd-34aa-4ff4-9fc6-4b5afbfde165',
  },
  {
    block_id: '7142e20a-0d30-47e5-aea8-546e0ec5e395',
    content: {
      data: 'quiz question',
    },
    type: 'quiz',
    answer: {
      data: 1,
    },
    revision: '06421c44-a853-4708-8f40-81c55a0e8861',
  },
  {
    block_id: '8483d0b2-9576-4b35-957b-58b63d097f6f',
    content: {
      data: 'paragraph text',
    },
    type: 'paragraph',
    revision: '5014d8d5-d4e3-4135-995f-0e84cded4cdb',
  },
  {
    block_id: 'aa34585e-130b-468c-be1a-5a8012f0d55a',
    content: {
      data: 'paragraph text',
    },
    type: 'paragraph',
    revision: '9f8ef6dd-34aa-4ff4-9fc6-4b5afbfde166',
  },
  {
    block_id: 'aa34585e-130b-468c-be1a-5a8012f0d56a',
    content: {
      data: 'paragraph text',
    },
    type: 'paragraph',
    revision: '9f8ef6dd-34aa-4ff4-9fc6-4b5afbfde266',
  },
  {
    block_id: 'aa34585e-130b-468c-be1a-5a8012f0d57a',
    type: 'next',
    revision: '9f8ef6dd-34aa-4ff4-9fc6-4b5afbfde366',
  },
  {
    block_id: 'aa34585e-130b-468c-be1a-5a8012f0b56a',
    content: {
      data: 'paragraph text',
    },
    type: 'paragraph',
    revision: '9f8ef6dd-34aa-4ff4-9fc6-4b5afbfbe266',
  },
  {
    block_id: '7142e20a-0d30-47e5-aea8-546e0ec5e396',
    content: {
      data: 'quiz question',
    },
    type: 'quiz',
    answer: {
      data: 1,
    },
    revision: '06421c44-a853-4708-8f40-81c55a0e8862',
  },
  {
    block_id: '8483d0b2-9576-4b35-957b-58b63d097f6b',
    content: {
      data: 'paragraph text',
    },
    type: 'paragraph',
    revision: '5014d8d5-d4e3-4135-995f-0e84cded4cdc',
  },
];

export const lessonBlockStructure = [
  {
    id: 'af7d4157-d009-4260-a42f-919ee4a55a9e',
    lesson_id: 100,
    block_id: 'aa34585e-130b-468c-be1a-5a8012f0d55c',
    child_id: '0b7e5d54-a78c-4340-abec-ee08713d43bd',
  },
  {
    id: '0b7e5d54-a78c-4340-abec-ee08713d43bd',
    lesson_id: 100,
    block_id: '7142e20a-0d30-47e5-aea8-546e0ec5e395',
    child_id: '9c3f1934-328e-44e0-8cf4-c52beb30c6b5',
    parent_id: 'af7d4157-d009-4260-a42f-919ee4a55a9e',
  },
  {
    id: '9c3f1934-328e-44e0-8cf4-c52beb30c6b5',
    lesson_id: 100,
    block_id: '8483d0b2-9576-4b35-957b-58b63d097f6f',
    parent_id: '0b7e5d54-a78c-4340-abec-ee08713d43bd',
  },
  {
    id: 'ee83a561-984e-4a5e-a438-de7d690293f8',
    lesson_id: 200,
    block_id: 'aa34585e-130b-468c-be1a-5a8012f0d55a',
    child_id: '10fb7bba-275c-4219-802f-1353f2d8a1ab',
  },
  {
    id: '10fb7bba-275c-4219-802f-1353f2d8a1ab',
    lesson_id: 200,
    block_id: 'aa34585e-130b-468c-be1a-5a8012f0d56a',
    child_id: '2b8e139e-9dbc-4be3-ba4e-04fbb67522f9',
    parent_id: 'ee83a561-984e-4a5e-a438-de7d690293f8',
  },
  {
    id: '2b8e139e-9dbc-4be3-ba4e-04fbb67522f9',
    lesson_id: 200,
    block_id: 'aa34585e-130b-468c-be1a-5a8012f0d57a',
    child_id: '15b2b1c4-2144-4330-8bff-b193eb80034f',
    parent_id: '10fb7bba-275c-4219-802f-1353f2d8a1ab',
  },
  {
    id: '15b2b1c4-2144-4330-8bff-b193eb80034f',
    lesson_id: 200,
    block_id: 'aa34585e-130b-468c-be1a-5a8012f0b56a',
    child_id: '0508329c-d849-420f-9d32-3fb8f66f0c64',
    parent_id: '2b8e139e-9dbc-4be3-ba4e-04fbb67522f9',
  },
  {
    id: '0508329c-d849-420f-9d32-3fb8f66f0c64',
    lesson_id: 200,
    block_id: '7142e20a-0d30-47e5-aea8-546e0ec5e396',
    child_id: 'acc796a2-444b-48ef-a93c-8480be7209eb',
    parent_id: '15b2b1c4-2144-4330-8bff-b193eb80034f',
  },
  {
    id: 'acc796a2-444b-48ef-a93c-8480be7209eb',
    lesson_id: 200,
    block_id: '8483d0b2-9576-4b35-957b-58b63d097f6b',
    parent_id: '0508329c-d849-420f-9d32-3fb8f66f0c64',
  },
];
