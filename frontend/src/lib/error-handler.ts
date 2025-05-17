export const getCustomError = (errorMessage: string, error: unknown): Error => {
  if (error instanceof Error) {
    errorMessage = `${errorMessage} : ${error.message}`;
  }
  return new Error(errorMessage);
};
