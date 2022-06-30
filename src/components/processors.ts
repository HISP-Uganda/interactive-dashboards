import { uniq } from "lodash";

export const processSingleValue = (data: any[]): any => {
  if (data.length > 0) {
    const values = Object.values(data[0]);
    if (data.length === 1 && Object.keys(data[0]).length === 1) {
      return values[0];
    }
    if (data.length === 1 && Object.keys(data[0]).length > 1) {
      return values[values.length - 1];
    }
  }
  return "";
};

export const processGraphs = (
  data: any[],
  type: string,
  category?: string,
  series?: string,
  metadata?: any
) => {
  let chartData: any = [];
  if (data && data.length > 0 && category) {
    const x = uniq(data.map((num: any) => num[category]));
    if (series) {
      const allSeries = uniq(data.map((num: any) => num[series]));
      chartData = allSeries.map((se: any) => {
        return {
          x: x.map((c: any) => metadata?.[c]?.name || c),
          y: x.map((c: any) => {
            const r = data.find(
              (num: any) => num[series] === se && num[category] === c
            );
            return r?.count || r?.value;
          }),
          name: metadata?.[se]?.name || se,
          type,
        };
      });
    } else {
      chartData = [
        {
          x: x.map((c: any) => metadata?.[c]?.name || c),
          y: x.map((c: any) => {
            const r = data.find((num: any) => num[category] === c);
            return r?.count || r?.value;
          }),
          type,
        },
      ];
    }
  }
  return chartData;
};

export const processPieChart = (
  data: any[],
  labels?: string,
  values?: string
) => {
  let chartData: any = [];
  if (data && data.length > 0 && labels && values) {
    const x = data.map((num: any) => num[labels]);
    const y = data.map((num: any) => num[values]);
    chartData = [
      {
        labels: x,
        values: y,
        type: "pie",
        textinfo: "label+percent+name",
        hoverinfo: "label+percent+name",
        textposition: "inside",
        // hole: 0.2,
      },
    ];
  }
  return chartData;
};

export const processDHIS2Indicator = () => {};

export const processOneDimension = (
  data: { [key: string]: any }[],
  dataSourceType: string,
  factor = 1
) => {
  const searchNumerator = data.find(
    (d) => Object.keys(d).findIndex((s) => s === "numerator") !== -1
  );
  let value;
  const searchDenominator = data.find(
    (d) => Object.keys(d).findIndex((s) => s === "denominator") !== -1
  );
  if (searchNumerator) {
    const { rows, height, width } = searchNumerator.numerator;
    value = rows[height - 1][width - 1];
  }
  if (searchDenominator) {
    const { rows, height, width } = searchDenominator.denominator;
    value = (value * factor) / rows[height - 1][width - 1];
  }
  return value;
};

export const processTwoDimensions = (
  data: { [key: string]: any }[],
  dataSourceType: string,
  factor = 1
) => {
  const searchNumerator = data.find(
    (d) => Object.keys(d).findIndex((s) => s === "numerator") !== -1
  );

  // const i = indicators.find((s) => s.denominator?.dataDimensions);
  let value;
  const searchDenominator = data.find(
    (d) => Object.keys(d).findIndex((s) => s === "denominator") !== -1
  );

  if (searchNumerator) {
    const { rows, height, width } = searchNumerator.numerator;
    value = rows[height - 1][width - 1];
  }
  if (searchDenominator) {
    const { rows, height, width } = searchDenominator.denominator;
    value = (value * factor) / rows[height - 1][width - 1];
  }
  return value;
};

export const processThreeDimensions = (
  data: { [key: string]: any }[],
  dataSourceType: string,
  factor = 1
) => {
  const searchNumerator = data.find(
    (d) => Object.keys(d).findIndex((s) => s === "numerator") !== -1
  );
  let value;
  const searchDenominator = data.find(
    (d) => Object.keys(d).findIndex((s) => s === "denominator") !== -1
  );
  if (searchNumerator) {
    const { rows, height, width } = searchNumerator.numerator;
    value = rows[height - 1][width - 1];
  }
  if (searchDenominator) {
    const { rows, height, width } = searchDenominator.denominator;
    value = (value * factor) / rows[height - 1][width - 1];
  }
  return value;
};