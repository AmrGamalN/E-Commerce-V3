export const generateSecretCode = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const generateOtp = (): string => {
  return Math.random().toString(36).substr(2, 6);
};
