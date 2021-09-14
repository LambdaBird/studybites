const chooseDB = () => {
  if (process.env.POSTGRES_DB) return process.env.POSTGRES_DB;
  if (process.env.DEMO_MODE) return 'demo_studybites';
  return 'studybites';
};

export default chooseDB;
