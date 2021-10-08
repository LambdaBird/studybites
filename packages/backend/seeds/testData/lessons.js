/* eslint no-underscore-dangle: "off", no-use-before-define: "off" */
export const math = {
  id: 10000,
  name: 'Math',
  status: 'Public',
  _blocks: {
    _indexesOfInteractive: [0],
    _current: [
      {
        id: '0b7e5d54-a78c-4340-abec-ee08713d43bd',
        block_id: '7142e20a-0d30-47e5-aea8-546e0ec5e395',
        _revisions: [
          {
            content: {
              data: 'quiz question',
            },
            type: 'quiz',
            answer: {
              results: [true, false, false],
            },
            revision: '06421c44-a853-4708-8f40-81c55a0e8861',
          },
        ],
      },
    ].map(assingParents),
  },
};

export const english = {
  id: 10001,
  name: 'English',
  status: 'Public',
};

export const biology = {
  id: 10002,
  name: 'Biology',
  status: 'Public',
};

export const literature = {
  id: 10003,
  name: 'Literature',
  status: 'Public',
};

export const russian = {
  id: 10004,
  name: 'Russian',
  status: 'Public',
  _blocks: {
    _current: [
      {
        id: 'f879f4eb-4ca1-44c3-9d28-10c0c289b76d',
        block_id: '96a775df-170a-47a2-8d59-854ff0037f40',
        _revisions: [
          {
            content: {
              data: 'paragraph text',
            },
            type: 'paragraph',
            revision: '5a47de81-d409-446b-8455-00eff9399f33',
          },
        ],
      },
    ].map(assingParents),
  },
};

export const french = {
  id: 20003,
  name: 'French',
  status: 'Public',
  _blocks: {
    _indexesOfInteractive: [2, 4],
    _current: [
      {
        id: 'ee83a561-984e-4a5e-a438-de7d690293f8',
        block_id: 'aa34585e-130b-468c-be1a-5a8012f0d55a',
        _revisions: [
          {
            content: {
              data: 'paragraph text',
            },
            type: 'paragraph',
            revision: '9f8ef6dd-34aa-4ff4-9fc6-4b5afbfde166',
          },
        ],
      },
      {
        id: '10fb7bba-275c-4219-802f-1353f2d8a1ab',
        block_id: 'aa34585e-130b-468c-be1a-5a8012f0d56a',
        _revisions: [
          {
            content: {
              data: 'paragraph text',
            },
            type: 'paragraph',
            revision: '9f8ef6dd-34aa-4ff4-9fc6-4b5afbfde266',
          },
        ],
      },
      {
        id: '2b8e139e-9dbc-4be3-ba4e-04fbb67522f9',
        block_id: 'aa34585e-130b-468c-be1a-5a8012f0d57a',
        _revisions: [
          {
            type: 'next',
            revision: '9f8ef6dd-34aa-4ff4-9fc6-4b5afbfde366',
          },
        ],
      },
      {
        id: '15b2b1c4-2144-4330-8bff-b193eb80034f',
        block_id: 'aa34585e-130b-468c-be1a-5a8012f0b56a',
        _revisions: [
          {
            content: {
              data: 'paragraph text',
            },
            type: 'paragraph',
            revision: '9f8ef6dd-34aa-4ff4-9fc6-4b5afbfbe266',
          },
        ],
      },
      {
        id: '0508329c-d849-420f-9d32-3fb8f66f0c64',
        block_id: '7142e20a-0d30-47e5-aea8-546e0ec5e396',
        _revisions: [
          {
            content: {
              data: 'quiz question',
            },
            type: 'quiz',
            answer: {
              results: [true, false, false],
            },
            revision: '06421c44-a853-4708-8f40-81c55a0e8862',
          },
        ],
      },
      {
        id: 'acc796a2-444b-48ef-a93c-8480be7209eb',
        block_id: '8483d0b2-9576-4b35-957b-58b63d097f6b',
        _revisions: [
          {
            content: {
              data: 'paragraph text',
            },
            type: 'paragraph',
            revision: '5014d8d5-d4e3-4135-995f-0e84cded4cdc',
          },
        ],
      },
    ].map(assingParents),
  },
};

export const lessons = [
  math,
  english,
  biology,
  literature,
  french,
  russian,
].map((lesson) => ({
  id: lesson.id,
  name: lesson.name,
  status: lesson.status,
}));

export const lessonBlockStructure = [math, french, russian].reduce(
  (structure, lesson) => {
    const lessonStructure = lesson._blocks._current.map((structureItem) => ({
      id: structureItem.id,
      block_id: structureItem.block_id,
      parent_id: structureItem.parent_id || null,
      child_id: structureItem.child_id || null,
      lesson_id: lesson.id,
    }));

    return [...structure, ...lessonStructure];
  },
  [],
);

export const blocks = [math, french, russian].reduce((blocksList, lesson) => {
  const lessonBlocks = lesson._blocks._current.reduce(
    (revisions, structureItem) => {
      const itemBlocks = structureItem._revisions.map((block) => ({
        ...block,
        block_id: structureItem.block_id,
      }));

      return [...revisions, ...itemBlocks];
    },
    [],
  );

  return [...blocksList, ...lessonBlocks];
}, []);

function assingParents(structureItem, index, list) {
  const parent = list[index - 1] || null;
  const child = list[index + 1] || null;
  return {
    ...structureItem,
    parent_id: parent && parent.id,
    child_id: child && child.id,
  };
}
