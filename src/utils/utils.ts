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
  { label: "Attribute Option Combo", value: "WSiMOMi4QWh", id: "aoc" },
  { label: "Category Option Combo", value: "p26VJMtSUSv", id: "coc" },
  { label: "Target Attribute Option Combo", value: "OOhWJ4gfZy1", id: "taoc" },
  { label: "Organisation Sublevel", value: "ww1uoD3DsYg", id: "osl" },
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
      return pe.buckets.flatMap(({ key, dx, ou, doc_count, total }: any) => {
        if (total) {
          return { ...obj, pe: key, value: total.value };
        }

        if (dx && dx.buckets) {
          return dx.buckets.flatMap(({ key, doc_count, total }: any) => {
            if (total) {
              return { ...obj, dx: key, value: total.value };
            }

            return { ...obj, dx: key, value: doc_count };
          });
        }

        if (ou && ou.buckets) {
          return ou.buckets.flatMap(({ key, doc_count, total }: any) => {
            if (total) {
              return { ...obj, ou: key, value: total.value };
            }

            return { ...obj, ou: key, value: doc_count };
          });
        }
        return { ...obj, pe: key, value: doc_count };
      });
    }

    if (dx && dx.buckets) {
      return dx.buckets.flatMap(({ key, pe, ou, doc_count, total }: any) => {
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
                return pe.buckets.flatMap(({ key, doc_count, total }: any) => {
                  if (total) {
                    return { ...obj, pe: key, value: total.value };
                  }
                  return { ...obj, pe: key, value: doc_count };
                });
              }

              if (ou && ou.buckets) {
                return ou.buckets.flatMap(({ key, doc_count, total }: any) => {
                  if (total) {
                    return { ...obj, ou: key, value: total.value };
                  }
                  return { ...obj, ou: key, value: doc_count };
                });
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
                  ({ key, ou, doc_count, total }: any) => {
                    if (total) {
                      return { ...obj, pe: key, value: total.value };
                    }

                    return { ...obj, pe: key, value: doc_count };
                  }
                );
              }

              if (dx && dx.buckets) {
                return dx.buckets.flatMap(({ key, doc_count, total }: any) => {
                  if (total) {
                    return { ...obj, dx: key, value: total.value };
                  }

                  return { ...obj, dx: key, value: doc_count };
                });
              }

              if (ou && ou.buckets) {
                return ou.buckets.flatMap(({ key, doc_count, total }: any) => {
                  if (total) {
                    return { ...obj, ou: key, value: total.value };
                  }

                  return { ...obj, ou: key, value: doc_count };
                });
              }
              return { ...obj, ou: key, value: doc_count };
            }
          );
        }
        return { ...obj, dx: key, value: doc_count };
      });
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

export const updateValAtKey: any = (
  obj: { [key: string]: any },
  path: string[],
  cb: any
) => {
  const checkValidPath: any = (obj: { [key: string]: any }, path: string[]) => {
    if (path.length > 1) {
      if (typeof obj[path[0]] !== "object") {
        return false;
      } else {
        return checkValidPath(obj[path[0]], path.slice(1, path.length));
      }
    } else {
      if (obj[path[0]]) {
        return true;
      } else {
        return false;
      }
    }
  };
  if (checkValidPath(obj, path)) {
    const key = path[0];
    if (path.length > 1) {
      return Object.assign({}, obj, {
        [key]: updateValAtKey(
          Object.assign({}, obj[key]),
          path.slice(1, path.length),
          cb
        ),
      });
    } else {
      return Object.assign({}, obj, { [key]: cb(obj[key]) });
    }
  }
};

export const colors: Option[] = [
  {
    label: "Color1",
    value: [
      "#e377c2",
      "#1f77b4",
      "#ff7f0e",
      "#2ca02c",
      "#d62728",
      "#9467bd",
      "#8c564b",
      "#7f7f7f",
      "#bcbd22",
    ].join(","),
  },
  {
    label: "Rich Black FOGRA 29",
    value:
      "#ca6702,#001219,#005f73,#0a9396,#94d2bd,#e9d8a6,#ee9b00,#bb3e03,#ae2012,#9b2226",
  },
  {
    label: "Melon",
    value:
      "#ece4db,#fec5bb,#fcd5ce,#fae1dd,#f8edeb,#e8e8e4,#d8e2dc,#ffe5d9,#ffd7ba,#fec89a",
  },
  {
    label: "Xiketic",
    value:
      "#dc2f02,#03071e,#370617,#6a040f,#9d0208,#d00000,#e85d04,#f48c06,#faa307,#ffba08",
  },
  {
    label: "Pink",
    value:
      "#480ca8,#f72585,#b5179e,#7209b7,#560bad,#3a0ca3,#3f37c9,#4361ee,#4895ef,#4cc9f0",
  },
  {
    label: "Purple",
    value:
      "#5390d9,#7400b8,#6930c3,#5e60ce,#4ea8de,#48bfe3,#56cfe1,#64dfdf,#72efdd,#80ffdb",
  },
  {
    label: "Desert Sand",
    value:
      "#edc4b3,#e6b8a2,#deab90,#d69f7e,#cd9777,#c38e70,#b07d62,#9d6b53,#8a5a44,#774936",
  },
  {
    label: "Red Salsa",
    value:
      "#f94144,#f3722c,#f8961e,#f9844a,#f9c74f,#90be6d,#43aa8b,#4d908e,#577590,#277da1",
  },
  {
    label: "Yellow Green Crayola",
    value:
      "#d9ed92,#b5e48c,#99d98c,#76c893,#52b69a,#34a0a4,#168aad,#1a759f,#1e6091,#184e77",
  },
  {
    label: "Cotton Candy",
    value:
      "#ffcbf2,#f3c4fb,#ecbcfd,#e5b3fe,#e2afff,#deaaff,#d8bbff,#d0d1ff,#c8e7ff,#c0fdff",
  },
  {
    label: "Spanish Viridian",
    value:
      "#007f5f,#2b9348,#55a630,#80b918,#aacc00,#bfd200,#d4d700,#dddf00,#eeef20,#ffff3f",
  },
  {
    label: "Ruby Red",
    value:
      "#0b090a,#161a1d,#660708,#a4161a,#ba181b,#e5383b,#b1a7a6,#d3d3d3,#f5f3f4,#ffffff",
  },
  {
    label: "Midnight Green",
    value:
      "#006466,#065a60,#0b525b,#144552,#1b3a4b,#212f45,#272640,#312244,#3e1f47,#4d194d",
  },
  {
    label: "Xiketic2",
    value:
      "#dc2f02,#ffba08,#2ca02c,#03071e,#370617,#6a040f,#9d0208,#d00000,#e85d04,#f48c06,#faa307",
  },
];

export const exclusions: any[] = [
  "lasso2d",
  "select2d",
  "sendDataToCloud",
  "zoom2d",
  "pan2d",
  "zoomIn2d",
  "zoomOut2d",
  "autoScale2d",
  "resetScale2d",
  "hoverClosestCartesian",
  "hoverCompareCartesian",
  "zoom3d",
  "pan3d",
  "orbitRotation",
  "tableRotation",
  "resetCameraDefault3d",
  "resetCameraLastSave3d",
  "hoverClosest3d",
  "zoomInGeo",
  "zoomOutGeo",
  "resetGeo",
  "hoverClosestGeo",
  "hoverClosestGl2d",
  "hoverClosestPie",
  "toggleHover",
  "resetViews",
  "toggleSpikelines",
];

export const chartTypes: Option[] = [
  { value: "single", label: "Single Value" },
  { value: "map", label: "Map" },
  { value: "bar", label: "Bar" },
  { value: "pie", label: "Pie" },
  { value: "line", label: "Line" },
  { value: "sunburst", label: "Sunburst" },
  { value: "gauge", label: "Gauge" },
  { value: "histogram", label: "Histogram" },
  { value: "area", label: "Area Graph" },
  { value: "radar", label: "Radar Graph" },
  { value: "bubblemaps", label: "Bubbble Maps" },
  { value: "funnelplot", label: "Funnel Graph" },
  { value: "multiplecharts", label: "Line and Graph" },
  { value: "treemaps", label: "Tree Map" },
  { value: "tables", label: "Table" },
  { value: "boxplot", label: "Box Plot" },
  { value: "scatterplot", label: "Scatter Plot" },
];

export const createOptions = (options: string[]): Option[] => {
  return options.map((option: string) => {
    return { label: option, value: option };
  });
};

export const divide = (expression: string, data: { [key: string]: any[] }) => {
  const indicators = expression.split("/");
  if (indicators && indicators.length === 2) {
    const [ind1, ind2] = indicators;
    const data1 = data[ind1];
    const data2 = data[ind2];
    if (data1 && data1.length === 1 && data2 && data2.length === 1) {
      return [{ total: data1[0].total / data2[0].total }];
    }
  }
  return [{ total: 0 }];
};

export const allMetadata: { [key: string]: string } = {
  CnIU4JH161i: "12 - 24 months",
  dZN788jq32i: "15 - 60 Years",
  euNzABJD0rl: "18- 24 months",
  rSn71nAWEyZ: "2 - <5 years",
  PkScN8lPCJu: "6 - 14 Years",
  PmQTItIJKn0: "9 Months - 5 Years",
  Hi8VxB592t8: "9-11 months",
  xBpTFgYQbPV: "9-17 months",
  lFFAVORlK5r: "Broken",
  jAbqv8bnCqT: "Contamination",
  daugmmgzAkU: "Day 1",
  C1IRVkhB3MW: "Day 2",
  L48zD78K9AI: "Day 3",
  zPaWaUOubgL: "Day 4",
  vmPAdWGX6qy: "Day 4 (Mop up day)",
  J9wUCeShAjk: "Day 5",
  Y5wiqIU7dAN: "Day 6",
  vHUFOwDZOc3: "Day 6 (Mop up day)",
  lUjup7J3S50: "Day 7",
  AXoc1QOgNgV: "Day 8 (Mop up day)",
  eSSFwmQpHNb: "Empty Vials",
  sdEKrqgmNxN: "Health Worker",
  oEMjNjU2n1l: "Mobiliser",
  BaOUxUBEAp1: "Other reason",
  HePDJphrRMS: "Parish Supervisor",
  BoDgo1kqT4s: "Partial use",
  CVphMdX3AqR: "Phase 1 (2022)",
  KGPe25jtndC: "Phase 2 (2023)",
  CU21ehevOUt: "Phase 3 (2024)",
  f0y7OUk8wtM: "Reactive (2021)",
  m7S4M4aWa4q: "Round 0 (2019)",
  G1R6RsITi8T: "Round 1",
  gqfR4Qrz6Nm: "Round 1 (2019)",
  W1PA9ZE0plu: "Round 2",
  sRZAXWz62eu: "Round 2 (2022)",
  pSRm6b16Baw: "Unusable Vials",
  f65rwx7h4rV: "Usable Vials",
  mlwTknbcGP4: "VVM Color Change",
  rKD38rD7HZ5: "Village Health Team",
  xYerKDKCefk: "default",
};
