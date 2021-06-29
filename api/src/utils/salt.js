import 'regenerator-runtime/runtime';
import bcrypt from 'bcrypt';

export const hashPassword = async (password) => bcrypt.hash(password, 12);

export const comparePasswords = async (password1, password2) =>
  bcrypt.compare(password1, password2);
