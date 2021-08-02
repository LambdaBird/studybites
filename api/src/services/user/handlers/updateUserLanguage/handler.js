export async function updateUserLanguageHandler({ user: { id }, body }) {
  const {
    models: { User },
  } = this;

  const data = await User.updateLanguage({
    userId: id,
    language: body.language,
  });

  return { settings: data?.settings };
}
