export const getInfoSystemConstant = (listConstant = [], key) => {
  const constant = listConstant.find((x) => x.key === key);
  return constant;
};
