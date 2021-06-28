export const lessons = [
  {
    id: 1,
    name: 'Public lesson',
    status: 'Public',
  },
  {
    id: 2,
    name: 'Draft lesson',
    status: 'Draft',
  },
  {
    id: 3,
    name: 'Private lesson',
    status: 'Private',
  },
  {
    id: 4,
    name: 'Archived lesson',
    status: 'Archived',
  },
  {
    id: 5,
    name: 'Learning was not started yet',
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
];

export const lessonBlockStructure = [
  {
    id: 'af7d4157-d009-4260-a42f-919ee4a55a9e',
    lesson_id: 1,
    block_id: 'aa34585e-130b-468c-be1a-5a8012f0d55c',
    child_id: '0b7e5d54-a78c-4340-abec-ee08713d43bd',
  },
  {
    id: '0b7e5d54-a78c-4340-abec-ee08713d43bd',
    lesson_id: 1,
    block_id: '7142e20a-0d30-47e5-aea8-546e0ec5e395',
    child_id: '9c3f1934-328e-44e0-8cf4-c52beb30c6b5',
    parent_id: 'af7d4157-d009-4260-a42f-919ee4a55a9e',
  },
  {
    id: '9c3f1934-328e-44e0-8cf4-c52beb30c6b5',
    lesson_id: 1,
    block_id: '8483d0b2-9576-4b35-957b-58b63d097f6f',
    parent_id: '0b7e5d54-a78c-4340-abec-ee08713d43bd',
  },
];
