import { uniqBy } from "lodash/fp";
import { fromPairs, groupBy, orderBy, sum } from "lodash";
import uniq from "lodash/uniq";
import update from "lodash/update";
import { Column, Threshold } from "../interfaces";
import { allMetadata } from "../utils/utils";
import { SPECIAL_COLUMNS } from "./constants";

const percentage = Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});
const formatter = Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

const breakString = (str: string, maxChars: number): string => {
    if (str.length > maxChars && str.includes(" ")) {
        let index = str.lastIndexOf(" ", maxChars);
        if (index === -1) index = str.indexOf(" ", maxChars + 1);
        return (
            str.substr(0, index) +
            "</br></br>" +
            breakString(str.substr(index + 1), maxChars)
        );
    } else {
        return str;
    }
};

function padZero(str: string, len: number = 2) {
    var zeros = new Array(len).join("0");
    return (zeros + str).slice(-len);
}

export function invertHex(hex: string, bw: boolean = true) {
    if (hex.indexOf("#") === 0) {
        hex = hex.slice(1);
    }
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        return "";
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
    }
    const r1 = (255 - r).toString(16);
    const g1 = (255 - g).toString(16);
    const b1 = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r1) + padZero(g1) + padZero(b1);
}

export const findColor = (
    val: number,
    thresholds: Threshold[],
    defaultValue: string
) => {
    return (
        thresholds.find(({ value }, index) => {
            if (index < thresholds.length - 1) {
                return val >= value && val < thresholds[index + 1].value;
            }
            return val >= value;
        })?.color || defaultValue
    );
};

const calculation = {
    count: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        const value = data.length;

        const color = findColor(value, thresholds, defaultValue);

        return {
            bg: color,
            color: invertHex(color),
            value: value,
        };
    },
    countUniqValues: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    listUniqueValues: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    sum: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        const total = sum(
            data.map((d) => {
                if (
                    others.aggregationColumn &&
                    Number(d[others.aggregationColumn]) !== NaN
                ) {
                    return Number(d[others.aggregationColumn]);
                }
                return 0;
            })
        );
        const color = findColor(total, thresholds, defaultValue);

        return {
            bg: color,
            color: invertHex(color),
            value: formatter.format(total),
        };
    },
    integerSum: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    average: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    median: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    sampleVariance: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    sampleStandardDeviation: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    minimum: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    maximum: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    first: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    last: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    sumOverSum: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    upperBound80: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    lowerBound80: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    sumFractionTotals: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    sumFractionRows: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    sumFractionColumns: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    countFractionTotals: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
    countFractionRows: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        let value = data.length;
        if (others.prevValue) {
            value = value / others.prevValue;
        }
        return { bg: "", value: percentage.format(value), color: "" };
    },
    countFractionColumns: (
        data: any[],
        thresholds: Threshold[],
        defaultValue: string,
        others: Partial<{
            aggregationColumn: string;
            col2: string;
            prevValue: number;
        }> = {}
    ) => {
        return { bg: "", value: "", color: "" };
    },
};

const findMerged = (list: string[], data: Array<any>) => {
    let finalColumns: Array<Array<Column>> = [];
    for (let index = 0; index < list.length; index++) {
        const col = list[index];
        let currentValues: Array<Column> = uniq(data.map((d) => d[col]))
            .filter((d) => !!d)
            .map((d) => {
                return { label: d, value: d, span: 1, actual: d };
            });
        currentValues = orderBy(currentValues, ["value"], ["desc"]);
        if (index === 0) {
            finalColumns[0] = currentValues;
        } else {
            const prev = finalColumns[index - 1];
            let nextValues: Array<Column> = [];
            for (const v of prev) {
                for (const p of currentValues) {
                    nextValues = [
                        ...nextValues,
                        {
                            label: `${v.label}${p.label}`,
                            value: `${v.value}${p.value}`,
                            span: 1,
                            actual: p.value,
                        },
                    ];
                }
            }
            finalColumns[index] = nextValues;
        }
    }

    return finalColumns.map((data, index, columns) => {
        if (index < columns.length - 1) {
            const last = columns[columns.length - 1].length;
            const current = columns[index].length;
            return data.map((x) => {
                return { ...x, span: last / current };
            });
        }
        return data;
    });
};

export const getLast = (data: any[], rows: string[], columns: string[]) => {
    let lastColumn = [];
    let lastRow = [];
    const validRows = rows.filter((d) => SPECIAL_COLUMNS.indexOf(d) === -1);
    const validCols = columns.filter((d) => SPECIAL_COLUMNS.indexOf(d) === -1);
    const specializedRows = rows.filter(
        (d) => SPECIAL_COLUMNS.indexOf(d) !== -1
    );
    const specializedCols = columns.filter(
        (d) => SPECIAL_COLUMNS.indexOf(d) !== -1
    );
    if (validRows.length > 0) {
        const lastR = validRows[validRows.length - 1];
        lastRow = uniq(data.map((d) => d[lastR])).filter((d) => !!d);
    }

    if (validCols.length > 0) {
        const lastC = validCols[validCols.length - 1];
        lastColumn = uniq(data.map((d) => d[lastC])).filter((d) => !!d);
    }

    return {
        lastColumn: [...lastColumn, ...specializedCols],
        lastRow: [...lastRow, ...specializedRows],
    };
};

export const processTable = (
    data: any[],
    rows: string[],
    columns: string[],
    aggregation: keyof typeof calculation,
    thresholds: Threshold[],
    aggregationColumn: string
) => {
    const finalColumns = findMerged(
        columns.filter((c) => SPECIAL_COLUMNS.indexOf(c) === -1),
        data
    );
    const finalRows = findMerged(
        rows.filter((c) => SPECIAL_COLUMNS.indexOf(c) === -1),
        data
    );

    const withoutBaseline = orderBy(
        thresholds.flatMap((val) => {
            if (val.id !== "baseline") {
                return val;
            }
            return [];
        }),
        ["value"],
        ["asc"]
    );

    const baseline =
        thresholds.find(({ id }) => id === "baseline")?.color || "";

    const groupedData = groupBy(data, (d) => rows.map((r) => d[r]).join(""));
    const finalData = Object.entries(groupedData)
        .flatMap(([key, values]) => {
            let rows = values;

            if (aggregationColumn) {
                rows = uniqBy(aggregationColumn, values);
            }
            const groupedByColumn = groupBy(values, (d) =>
                columns
                    .filter((r) => SPECIAL_COLUMNS.indexOf(r) === -1)
                    .map((r) => d[r])
                    .join("")
            );
            const normal = Object.entries(groupedByColumn).map(
                ([columnKey, columnData]) => {
                    return {
                        key: `${key}${columnKey}`,
                        value: calculation[aggregation](
                            columnData,
                            withoutBaseline,
                            baseline,
                            {
                                aggregationColumn,
                                prevValue: rows.length,
                            }
                        ),
                    };
                }
            );

            return [
                ...normal,
                {
                    key: `${key}rowCount`,
                    value: { bg: "", value: rows.length, color: "" },
                },
            ];
        })
        .map(({ key, value }) => {
            return [key, value];
        });

    return {
        finalColumns,
        finalRows,
        finalData: fromPairs(finalData),
    };
};

export const processSingleValue = (
    data: any[],
    aggregate: boolean,
    aggregationColumn: string,
    key: string,
    uniqColumn: string
): any => {
    if (data.length > 0) {
        if (aggregate && aggregationColumn && key) {
            const grouped = groupBy(data, aggregationColumn);
            const value = uniqColumn
                ? uniqBy(uniqColumn, grouped[key]).length
                : grouped[key]?.length;
            return value;
        } else if (aggregate && aggregationColumn) {
            return Object.keys(groupBy(data, aggregationColumn)).length;
        } else if (aggregate) {
            return data.length;
        } else {
            const values = Object.values(data[0]);
            if (data.length === 1 && Object.keys(data[0]).length === 1) {
                return values[0];
            }
            if (data.length === 1 && Object.keys(data[0]).length > 1) {
                return values[values.length - 1];
            }
        }
    }
    return "-";
};

export const processGraphs = (
    data: any[],
    order: string,
    show: number,
    summarize: boolean,
    dataProperties = {},
    category?: string,
    series?: string,
    metadata?: any,
    type: string = "bar"
) => {
    let chartData: any = [];
    let availableProperties: { [key: string]: any } = {};
    let allSeries = [];
    update(availableProperties, "data.orientation", () => "v");
    Object.entries(dataProperties).forEach(([property, value]) => {
        availableProperties = update(
            availableProperties,
            property,
            () => value
        );
    });

    if (data && data.length > 0 && category) {
        if (summarize) {
            if (series) {
                const grouped = groupBy(data, series);
                chartData = Object.entries(grouped).map(([key, values]) => {
                    const groupedByTheme = groupBy(values, category);

                    let others = {};

                    if (metadata[`${key}.bg`]) {
                        others = {
                            marker: {
                                color: metadata[`${key}.bg`],
                            },
                        };
                    }
                    return {
                        x: orderBy(
                            Object.keys(groupedByTheme),
                            undefined,
                            "asc"
                        ).map((k) =>
                            breakString(metadata[`${k}.name`] || k, 25)
                        ),
                        y: Object.entries(groupedByTheme).map(
                            ([k, val]) => val.length
                        ),
                        name: key,
                        type: "bar",
                        ...availableProperties.data,
                        textposition: "auto",
                        texttemplate:
                            availableProperties?.data?.orientation === "v"
                                ? "%{y:.0f}"
                                : "%{x:.0f}",
                        ...others,
                    };
                });
                allSeries = Object.keys(groupBy(data, series));
            } else {
                const grouped2 = groupBy(data, category);

                chartData = [
                    {
                        x: Object.keys(grouped2).map((k) =>
                            breakString(metadata[`${k}.name`] || k, 25)
                        ),
                        y: Object.values(grouped2).map((x) => x.length),
                        type: "bar",
                        ...availableProperties.data,
                        textposition: "auto",
                        texttemplate:
                            availableProperties?.data?.orientation === "v"
                                ? "%{y:.0f}"
                                : "%{x:.0f}",
                    },
                ];
                allSeries = Object.keys(grouped2);
            }
        } else {
            if (order) {
                data = orderBy(data, "value", [order as "asc" | "desc"]);
            }
            if (show) {
                data = data.slice(0, show);
            }

            const x = uniq(data.map((num: any) => num[category]));
            const columns = x.map((c: any) => {
                return {
                    id: c,
                    name: allMetadata[c] || metadata?.[c]?.name || c,
                };
            });

            const realColumns = columns.map(({ name }) => name);
            if (series) {
                allSeries = uniq(data.map((num: any) => num[series]));
                chartData = allSeries.map((se: any) => {
                    return {
                        x:
                            availableProperties?.data?.orientation === "v"
                                ? realColumns
                                : columns.map(({ id }) => {
                                      const r = data.find(
                                          (num: any) =>
                                              num[series] === se &&
                                              num[category] === id
                                      );
                                      return r?.count || r?.value || r?.total;
                                  }),
                        y:
                            availableProperties?.data?.orientation === "v"
                                ? columns.map(({ id }) => {
                                      const r = data.find(
                                          (num: any) =>
                                              num[series] === se &&
                                              num[category] === id
                                      );
                                      return r?.count || r?.value || r?.total;
                                  })
                                : realColumns,
                        name: metadata?.[se]?.name || se,
                        type: availableProperties?.data?.[se] || type,
                        ...availableProperties.data,
                        textposition: "auto",
                        texttemplate:
                            availableProperties?.data?.orientation === "v"
                                ? "%{y:.0f}"
                                : "%{x:.0f}",
                    };
                });
            } else {
                allSeries = [];
                chartData = [
                    {
                        x:
                            availableProperties?.data?.orientation === "v"
                                ? realColumns
                                : columns.map(({ id }) => {
                                      const r = data.find(
                                          (num: any) => num[category] === id
                                      );
                                      return r?.count || r?.value || r?.total;
                                  }),
                        y:
                            availableProperties?.data?.orientation === "v"
                                ? columns.map(({ id }) => {
                                      const r = data.find(
                                          (num: any) => num[category] === id
                                      );
                                      return r?.count || r?.value || r?.total;
                                  })
                                : realColumns,
                        type,
                        ...availableProperties.data,
                        textposition: "auto",
                        texttemplate:
                            availableProperties?.data?.orientation === "v"
                                ? "%{y:.0f}"
                                : "%{x:.0f}",
                    },
                ];
            }
        }
    }
    return {
        chartData: orderBy(chartData, "name", "desc"),
        allSeries,
    };
};

export const processPieChart = (
    data: any[],
    summarize: boolean,
    labels?: string,
    values?: string,
    metadata?: any
): any => {
    let x = [];
    let y = [];
    let colors = [];
    if (data && data.length > 0 && summarize) {
        const processed = fromPairs(
            Object.entries(groupBy(data, labels)).map(([key, values]) => [
                metadata[`${key}.name`] || key,
                values.length,
            ])
        );
        colors = Object.entries(groupBy(data, labels)).map(
            ([key, values]) => metadata[`${key}.bg`]
        );
        x = Object.keys(processed);
        y = Object.values(processed);
    } else if (data && data.length > 0 && labels && values) {
        x = data.map((num: any) => {
            return (
                metadata?.[num[labels]]?.name ||
                allMetadata[labels] ||
                num[labels]
            );
        });
        y = data.map((num: any) => num[values]);
    }
    return [
        {
            labels: x,
            values: y,
            type: "pie",
            textinfo: "label+percent+name",
            hoverinfo: "label+percent+name",
            textposition: "inside",
            textfont: {
                size: [16, 16, 16],
                color:
                    colors.length > 0
                        ? colors.map((c) => invertHex(c, true))
                        : undefined,
            },
            hole: 0.1,
            marker: {
                colors: colors.length > 0 ? colors : undefined,
            },
        },
    ];
};

export const processGaugeChart = (
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
