import objection from 'objection';

export class QueryBuilder extends objection.QueryBuilder {
  search({ columns, searchString }) {
    return this.skipUndefined().where(
      columns,
      'ilike',
      searchString ? `%${searchString.replace(/ /g, '%')}%` : undefined,
    );
  }
}
