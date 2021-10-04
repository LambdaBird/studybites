import objection from 'objection';

export class QueryBuilder extends objection.QueryBuilder {
  search({ columns, searchString }) {
    return this.skipUndefined().where(
      this.knex().raw(`concat(${columns.join(", ' ', ")}, '', ${columns[0]})`),
      'ilike',
      searchString ? `%${searchString.replace(/ /g, '%')}%` : undefined,
    );
  }
}
