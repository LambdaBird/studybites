/* eslint-disable max-classes-per-file */
import objection from 'objection';

export default class BaseQueryBuilder extends objection.QueryBuilder {
  withTotal() {
    this.select(objection.raw(`count (*) over() as total`));
    return this;
  }

  withSearch(name, query) {
    this.skipUndefined().where(query ? name : undefined, 'ilike', `%${query}%`);
    return this;
  }

  withPagination(query, config) {
    this.offset(query.offset || 0).limit(query.limit || config);
    return this;
  }
}
