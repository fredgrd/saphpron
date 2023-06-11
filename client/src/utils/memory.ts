export const deepCopy = <T>(value: T): T => {
  const copy = JSON.parse(JSON.stringify(value));
  return copy as T;
};
