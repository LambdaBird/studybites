const formatAlterTableEnumSql = (tableName, columnName, enums) => {
  const constraintName = `${tableName}_${columnName}_check`;
  return [
    `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${constraintName};`,
    `ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} CHECK (${columnName} = ANY (ARRAY['${enums.join(
      "'::text, '",
    )}'::text]));`,
  ].join('\n');
};

export const up = (knex) =>
  knex.raw(
    formatAlterTableEnumSql('lessons', 'status', [
      'Draft',
      'Public',
      'Private',
      'Archived',
      'CourseOnly',
    ]),
  );

export const down = (knex) => {
  knex('lessons').update({ status: 'Private' }).where({ status: 'CourseOnly' });
  knex.raw(
    formatAlterTableEnumSql('lessons', 'status', [
      'Draft',
      'Public',
      'Private',
      'Archived',
    ]),
  );
};
