import { NotFoundError } from '../../../../validation/errors';

export async function enrollDemoHandler(req) {
  const {
    config: {
      lessonService: { lessonServiceErrors: errors },
      globals: { roles },
    },
    models: { User, UserRole, Lesson },
    createAccessToken,
    createRefreshToken,
  } = this;

  let userId;
  let accessToken;
  let refreshToken;

  try {
    const { id } = await req.jwtVerify();
    userId = id;
  } catch (error) {
    const userData = await User.query().insert({}).returning('*');

    userId = userData.id;
    accessToken = createAccessToken(this, userId);
    refreshToken = createRefreshToken(this, userId);
  }

  const lessonId = +req.params.lesson_id;

  const enrolledUser = await UserRole.query()
    .where({
      user_id: userId,
      role_id: roles.STUDENT.id,
      resource_type: 'lesson',
      resource_id: lessonId,
    })
    .first();

  const lesson = await Lesson.query()
    .findById(lessonId)
    .where({ status: 'Public' });

  if (!lesson) {
    throw new NotFoundError(errors.LESSON_ERR_LESSON_NOT_FOUND);
  }

  if (enrolledUser) {
    return {
      accessToken,
      refreshToken,
      lesson_id: lesson.id,
      user_id: userId,
    };
  }

  await this.models.UserRole.query()
    .insert({
      user_id: userId,
      role_id: this.config.globals.roles.STUDENT.id,
      resource_type: 'lesson',
      resource_id: lesson.id,
    })
    .returning('*');

  return {
    accessToken,
    refreshToken,
    lessonId: lesson.id,
    userId,
  };
}
