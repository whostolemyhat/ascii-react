export const chunk = function (array: ImageData['data'], count: number) {
  if (count == null || count < 1) return [];

  const result = [];
  const length = array.length;
  let i = 0;
  while (i < length) {
    result.push(Array.prototype.slice.call(array, i, (i += count)));
  }
  return result;
};
