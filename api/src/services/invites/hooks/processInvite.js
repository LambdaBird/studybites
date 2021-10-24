import { BadRequestError } from '../../../validation/errors';

export default async function processInvite({ req, resourceType, resourceId }) {
  const {
    models: { Invite },
    config: {
      lessonService: { lessonServiceErrors: errors },
    },
  } = this;

  const { body, params, user } = req;

  if (body?.invite) {
    const invite = await Invite.checkIfPendingInvite({
      inviteId: body.invite,
      resourceId,
      resourceType,
    });

    if (invite.email) {
      params.isInvite = true;
      if (invite.email !== user.email) {
        throw new BadRequestError(errors.LESSON_ERR_FAIL_ENROLL);
      }
    }
  }
}
