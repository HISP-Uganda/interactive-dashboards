export const processSingleValuedSQLViews = (data: { [key: string]: any }[]) => {
  const searchNumerator = data.find(
    (d) => Object.keys(d).findIndex((s) => s === "numerator") !== -1
  );
  if (searchNumerator) {
    const {
      listGrid: { height, width, rows },
    } = searchNumerator.numerator;
    if (height === 1 && width === 1) {
      return rows[0][0];
    }
  }
  return 0;
};
