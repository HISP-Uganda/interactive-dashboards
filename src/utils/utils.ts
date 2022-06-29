import moment from "moment";
import {
  format,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  eachYearOfInterval,
  eachWeekOfInterval,
} from "date-fns";
type periodType = "days" | "weeks" | "months" | "years" | "quarters";
import { Option } from "../interfaces";
import { uniq } from "lodash";

export function encodeToBinary(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
}
export function decodeFromBinary(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

/*
 * Get an array of last periods
 *
 * @param n the number to look back e.g n months back
 * @param periodType the type of periods. one of weeks, months, quarters, years
 * @paran includeCurrent whether to include current period. e.g if true last_3_months includes the current month
 * @return a list of relative periods
 */
const lastNPeriods = (
  n: number,
  periodType: periodType,
  includeCurrent: boolean = false
) => {
  /*The momentjs fomarts for the periodsTypes*/
  const dateFormats: { [key: string]: string } = {
    days: "YYYYMMDD",
    weeks: "YYYY[W]W",
    months: "YYYYMM",
    years: "YYYY",
    quarters: "YYYY[Q]Q",
  };

  const periods = new Set<string>();
  /* toLocaleUpperCase() is added because of special treatment to quarters formating*/
  if (n === 0) {
    periods.add(moment().format(dateFormats[periodType]));
    return Array.from(periods);
  }
  for (let i = n; i >= 1; i--) {
    periods.add(
      moment().subtract(i, periodType).format(dateFormats[periodType])
    );
  }
  if (includeCurrent) {
    periods.add(moment().format(dateFormats[periodType]));
  }
  return Array.from(periods);
};

export const relativePeriods: any = {
  TODAY: lastNPeriods(0, "days"),
  YESTERDAY: lastNPeriods(1, "days"),
  LAST_3_DAYS: lastNPeriods(3, "days"),
  LAST_7_DAYS: lastNPeriods(7, "days"),
  LAST_14_DAYS: lastNPeriods(14, "days"),
  LAST_30_DAYS: lastNPeriods(30, "days"),
  LAST_60_DAYS: lastNPeriods(60, "days"),
  LAST_90_DAYS: lastNPeriods(90, "days"),
  LAST_180_DAYS: lastNPeriods(180, "days"),
  THIS_WEEK: lastNPeriods(0, "weeks"),
  LAST_WEEK: lastNPeriods(1, "weeks"),
  LAST_4_WEEKS: lastNPeriods(4, "weeks"),
  LAST_12_WEEKS: lastNPeriods(12, "weeks"),
  LAST_52_WEEKS: lastNPeriods(52, "weeks"),
  WEEKS_THIS_YEAR: lastNPeriods(moment().week() - 1, "weeks", true),
  THIS_MONTH: lastNPeriods(0, "months"),
  LAST_MONTH: lastNPeriods(1, "months"),
  LAST_3_MONTHS: lastNPeriods(3, "months"),
  LAST_6_MONTHS: lastNPeriods(6, "months"),
  LAST_12_MONTHS: lastNPeriods(12, "months"),
  MONTHS_THIS_YEAR: lastNPeriods(moment().month(), "months", true),
  THIS_YEAR: lastNPeriods(0, "years"),
  LAST_YEAR: lastNPeriods(1, "years"),
  LAST_5_YEARS: lastNPeriods(5, "years"),
  LAST_10_YEARS: lastNPeriods(10, "years"),
  THIS_QUARTER: lastNPeriods(0, "quarters"),
  LAST_QUARTER: lastNPeriods(1, "quarters"),
  LAST_4_QUARTERS: lastNPeriods(4, "quarters"),
  QUARTERS_THIS_YEAR: lastNPeriods(moment().quarter() - 1, "quarters", true),
};
export const relativePeriodTypes = Object.keys(relativePeriods);
export const getRelativePeriods = (periodString: string) => {
  return relativePeriods[periodString] || relativePeriods["LAST_MONTH"];
};

const isWorthy = (data: any[]) => {
  if (data.length === 1 && Object.keys(data[0]).length <= 2) {
    return ["single"];
  }
  if (data.length > 1 && Object.keys(data[0]).length === 2) {
    return ["bar", "pie", "map"];
  }

  if (data.length > 1 && Object.keys(data[0]).length === 3) {
    return ["bar"];
  }

  if (data.length > 1 && Object.keys(data[0]).length === 4) {
    return ["multiple"];
  }
  return [];
};

export const globalIds: Option[] = [
  { label: "Period", value: "m5D13FqKZwN", id: "pe" },
  { label: "Program Indicator", value: "Eep3rko7uh6", id: "pi" },
  { label: "Indicator", value: "JRDOr08JWSW", id: "i" },
  { label: "Organisation Group", value: "of2WvtwqbHR", id: "oug" },
  { label: "Organisation Level", value: "GQhi6pRnTKF", id: "oul" },
  { label: "Organisation", value: "mclvD0Z9mfT", id: "ou" },
  { label: "Data Element", value: "h9oh0VhweQM", id: "de" },
];

export const convertTime = (value: string) => {
  if (value === "off") {
    return -1;
  }

  if (value.endsWith("s")) {
    return;
  }
};

export const getSearchParams = (query?: string) => {
  if (query) {
    const all = query.match(/\${\w+}/g);
    if (all !== null) {
      return uniq(all.map((s) => s.replace("${", "").replace("}", "")));
    }
  }
  return [];
};

export const getPeriodsBetweenDates = (
  start?: Date,
  end?: Date,
  periodType?: string
) => {
  if (start && end && periodType) {
    const all: { [key: string]: string[] } = {
      date: eachDayOfInterval({ start, end }).map((d: Date) =>
        format(d, "yyyyMMdd")
      ),
      week: eachWeekOfInterval({ start, end }).map((d: Date) =>
        format(d, "yyyy'W'w")
      ),
      month: eachMonthOfInterval({ start, end }).map((d: Date) =>
        format(d, "yyyyMM")
      ),
      quarter: eachQuarterOfInterval({ start, end }).map((d: Date) =>
        format(d, "yyyyQQQ")
      ),
      year: eachYearOfInterval({ start, end }).map((d: Date) =>
        format(d, "yyyy")
      ),
    };
    return all[periodType] || all["month"];
  }
  return [];
};

export const nest: any = (items: any[], id = null, link = "parent") =>
  items
    .filter((item) => item[link] === id)
    .map((item) => {
      const children = nest(items, item.key);
      if (children.length > 0) {
        return { ...item, children };
      }
      return { ...item };
    });

const iterate = (obj: { [key: string]: any }) => {
  Object.keys(obj).forEach((key) => {
    console.log(`key: ${key}, value: ${obj[key]}`);
    if (typeof obj[key] === "object") {
      iterate(obj[key]);
    }
  });
};

export const getNestedKeys = (data: { [key: string]: any }, keys: string[]) => {
  if (!(data instanceof Array) && typeof data == "object") {
    Object.keys(data).forEach((key) => {
      keys.push(key);
      const value = data[key];
      if (typeof value === "object" && !(value instanceof Array)) {
        getNestedKeys(value, keys);
      }
    });
  }
  return keys;
};

export const oneBucketAggregation = (data: { [key: string]: any }) => {
  data.buckets;
};
export const oneMetricAggregation = (data: { [key: string]: any }) => {
  return data;
};

const getKeyString = (data: { [key: string]: any }) => {
  if (data.pe) {
    return "pe";
  }
  if (data.dx) {
    return "dx";
  }
  if (data.ou) {
    return "ou";
  }
  return "";
};

export const bucketMetricAggregation = (data: { [key: string]: any }) => {
  return data.buckets.flatMap(({ key, doc_count, pe, dx, ou, total }: any) => {
    let obj = { key };
    if (total) {
      return { ...obj, value: total.value };
    }

    if (pe && pe.buckets) {
      return pe.buckets.flatMap(
        ({ key, pe, dx, ou, doc_count, total }: any) => {
          if (total) {
            return { ...obj, pe: key, value: total.value };
          }

          if (dx && dx.buckets) {
            return dx.buckets.flatMap(
              ({ key, pe, dx, ou, doc_count, total }: any) => {
                if (total) {
                  return { ...obj, dx: key, value: total.value };
                }

                return { ...obj, dx: key, value: doc_count };
              }
            );
          }

          if (ou && ou.buckets) {
            return ou.buckets.flatMap(
              ({ key, pe, dx, ou, doc_count, total }: any) => {
                if (total) {
                  return { ...obj, ou: key, value: total.value };
                }

                return { ...obj, ou: key, value: doc_count };
              }
            );
          }
          return { ...obj, pe: key, value: doc_count };
        }
      );
    }

    if (dx && dx.buckets) {
      return dx.buckets.flatMap(
        ({ key, pe, dx, ou, doc_count, total }: any) => {
          if (total) {
            return { ...obj, dx: key, value: total.value };
          }

          if (pe && pe.buckets) {
            return pe.buckets.flatMap(
              ({ key, pe, ou, doc_count, total }: any) => {
                if (total) {
                  return { ...obj, pe: key, value: total.value };
                }

                if (pe && pe.buckets) {
                  return pe.buckets.flatMap(
                    ({ key, pe, dx, ou, doc_count, total }: any) => {
                      if (total) {
                        return { ...obj, pe: key, value: total.value };
                      }

                      return { ...obj, pe: key, value: doc_count };
                    }
                  );
                }

                if (ou && ou.buckets) {
                  return ou.buckets.flatMap(
                    ({ key, pe, dx, ou, doc_count, total }: any) => {
                      if (total) {
                        return { ...obj, ou: key, value: total.value };
                      }

                      return { ...obj, ou: key, value: doc_count };
                    }
                  );
                }

                return { ...obj, pe: key, value: doc_count };
              }
            );
          }

          if (ou && ou.buckets) {
            return ou.buckets.flatMap(
              ({ key, pe, dx, ou, doc_count, total }: any) => {
                if (total) {
                  return { ...obj, ou: key, value: total.value };
                }

                if (pe && pe.buckets) {
                  return pe.buckets.flatMap(
                    ({ key, pe, dx, ou, doc_count, total }: any) => {
                      if (total) {
                        return { ...obj, pe: key, value: total.value };
                      }

                      return { ...obj, pe: key, value: doc_count };
                    }
                  );
                }

                if (dx && dx.buckets) {
                  return dx.buckets.flatMap(
                    ({ key, pe, dx, ou, doc_count, total }: any) => {
                      if (total) {
                        return { ...obj, dx: key, value: total.value };
                      }

                      return { ...obj, dx: key, value: doc_count };
                    }
                  );
                }

                if (ou && ou.buckets) {
                  return ou.buckets.flatMap(
                    ({ key, pe, dx, ou, doc_count, total }: any) => {
                      if (total) {
                        return { ...obj, ou: key, value: total.value };
                      }

                      return { ...obj, ou: key, value: doc_count };
                    }
                  );
                }
                return { ...obj, ou: key, value: doc_count };
              }
            );
          }
          return { ...obj, dx: key, value: doc_count };
        }
      );
    }

    if (ou && ou.buckets) {
      return ou.buckets.flatMap(
        ({ key, pe, dx, ou, doc_count, total }: any) => {
          if (total) {
            return { ...obj, ou: key, value: total.value };
          }

          return { ...obj, ou: key, value: doc_count };
        }
      );
    }

    return { ...obj, value: doc_count };
  });
};

export function traverse(node: any, query: { [key: string]: any }) {
  if (
    node.numerator &&
    node.denominator &&
    !node.numerator.buckets &&
    !node.denominator.buckets
  ) {
    const numerator = node.numerator.value;
    const denominator = node.denominator.value;
    if (denominator !== 0) {
      return [{ value: (numerator * 100) / denominator }];
    }
  } else if (node.numerator && !node.numerator.buckets) {
    return [node.numerator];
  } else if (
    node.numerator &&
    node.denominator &&
    node.numerator.buckets &&
    node.denominator.buckets
  ) {
    const numerators = node.numerator.buckets.map((bucket: any) => {});
    const denominators = node.denominator.buckets.map((bucket: any) => {});
  } else if (node.numerator && node.numerator.buckets) {
    return node.numerator.buckets.map((bucket: any) => {
      // const;
    });
  }
  return [{ value: 0 }];
}
