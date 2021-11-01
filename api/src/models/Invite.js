import BaseModel from './BaseModel';
import { BadRequestError, NotFoundError } from '../validation/errors';
import {
  invitesServiceErrors,
  invitesStatuses,
  lessonServiceErrors as errors,
} from '../config';

class Invite extends BaseModel {
  static get tableName() {
    return 'invites';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        resourceId: { type: 'integer' },
        resourceType: { type: 'string' },
        status: { type: 'string' },
        email: { type: 'string' },
        emailStatus: { type: 'string' },
        createdAt: { type: 'string' },
      },
    };
  }

  static checkIfPendingInvite({ inviteId, resourceId, resourceType }) {
    return this.query()
      .first()
      .where({
        id: inviteId,
        resource_id: resourceId,
        resource_type: resourceType,
        status: invitesStatuses.PENDING,
      })
      .throwIfNotFound({
        error: new BadRequestError(errors.LESSON_ERR_FAIL_ENROLL),
      });
  }

  static setInviteSuccess({ trx, inviteId }) {
    return this.query(trx)
      .findById(inviteId)
      .patch({ status: invitesStatuses.SUCCESS });
  }

  static revokeInvites({ trx, resourceId, resourceType, emails }) {
    const query = this.query(trx)
      .patch({ status: invitesStatuses.REVOKED })
      .where({
        resource_id: resourceId,
        resource_type: resourceType,
        status: invitesStatuses.PENDING,
      })
      .returning('*');

    if (emails.length) {
      query.whereIn('email', emails);
    } else {
      query.whereNull('email');
    }

    return query;
  }

  static createInvites({ trx, data }) {
    return this.query(trx).skipUndefined().insert(data).returning('*');
  }

  static getInviteById({ inviteId }) {
    return this.query()
      .findById(inviteId)
      .throwIfNotFound({
        errors: new NotFoundError(invitesServiceErrors.INVITE_ERR_NOT_FOUND),
      });
  }

  static getResourceInvites({ resourceId, resourceType }) {
    return this.query().where({
      resource_id: resourceId,
      resource_type: resourceType,
    });
  }

  static revokeOneInvite({ inviteId }) {
    return this.query()
      .findById(inviteId)
      .patch({ status: invitesStatuses.REVOKED });
  }
}

export default Invite;
