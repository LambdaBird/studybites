import objection from 'objection';

export class QueryBuilder extends objection.QueryBuilder {
  search({ columns, searchString }) {
    return this.skipUndefined().where(
      this.knex().raw(`concat(${columns.join(", ' ', ")})`),
      'ilike',
      searchString ? `%${searchString.replace(/ /g, '%')}%` : undefined,
    );
  }
}
