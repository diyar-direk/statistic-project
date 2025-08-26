export const formatArray = (arr, callback, separator = ",") => {
  if (!Array.isArray(arr)) return "";

  return arr
    .map((obj) => {
      return callback ? callback(obj) : obj;
    })
    .join(separator);
};
