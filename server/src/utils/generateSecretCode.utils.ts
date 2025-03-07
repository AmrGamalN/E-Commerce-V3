export const generateSecretCode = (): string => {
  const secretCode = Math.random().toString(36).substr(2, 9);
  return secretCode;
};
