export async function updateUserLanguageHandler({
  user: { id },
  body: { language },
}) {
  const {
    models: { User },
  } = this;

  const data = await User.updateLanguage({
    userId: id,
    language,
  });

  return { settings: data?.settings };
}
