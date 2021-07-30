export async function selfHandler({ user: { id: userId } }) {
  const {
    models: { User },
  } = this;

  const user = await User.self({ userId });

  return { ...user };
}
