export const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

export const isValidEmail = (email) =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPassword = (password) =>
  typeof password === "string" && password.length >= 6;

export const isValidRole = (role) =>
  ["learner", "teacher"].includes(role);

export const isValidDifficulty = (difficulty) =>
  ["easy", "medium", "hard"].includes(difficulty);