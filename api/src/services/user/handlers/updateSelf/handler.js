export async function updateSelfHandler({
  user: { id: userId },
  body: { firstName, lastName, email },
}) {
  const {
    models: { User },
  } = this;

  const updatedUser = await User.updateSelf({
    userId,
    user: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    },
  });

  return { ...updatedUser };
}
