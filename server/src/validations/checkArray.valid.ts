import { check } from "express-validator";

export const checkArray = (field: string, errorMessage: string) => {
  return check(field).custom((value) => {
    if (!Array.isArray(value)) {
      return Promise.reject(`${field.toUpperCase()} MUST BE AN ARRAY`);
    }

    // Can be accept number with string
    if (field === "addressIds") {
      const isValid = value.every((item) => /^[A-Za-z0-9-_\s]+$/.test(item));
      return isValid ? true : Promise.reject(errorMessage);
    }

    const isValid = value.every((item) => /^[A-Za-z\s]+$/.test(item));
    return isValid ? true : Promise.reject(errorMessage);
  });
};
