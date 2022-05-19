import moment from "moment";

type periodType = "days" | "weeks" | "months" | "years" | "quarters";
import { Option } from "../interfaces";

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
): Array<string> => {
  /*The momentjs fomarts for the periodsTypes*/
  const dateFormats: { [key: string]: string } = {
    days: "YYYYMMDD",
    weeks: "YYYY[W]WW",
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
export const getRelativePeriods = (periodString: string): Array<string> => {
  const relativePeriods: any = {
    TODAY: lastNPeriods(0, "days"),
    LAST_14_DAYS: lastNPeriods(14, "days"),
    THIS_WEEK: lastNPeriods(0, "weeks"),
    LAST_WEEK: lastNPeriods(1, "weeks"),
    LAST_4_WEEKS: lastNPeriods(4, "weeks"),
    THIS_MONTH: lastNPeriods(0, "months"),
    LAST_MONTH: lastNPeriods(1, "months"),
    LAST_3_MONTHS: lastNPeriods(3, "months"),
    LAST_6_MONTHS: lastNPeriods(6, "months"),
    LAST_12_MONTHS: lastNPeriods(12, "months"),
    MONTHS_THIS_YEAR: lastNPeriods(
      moment().month(),
      "months",
      true
    ) /* include current month*/,
    THIS_YEAR: lastNPeriods(0, "years"),
    LAST_YEAR: lastNPeriods(1, "years"),
    LAST_3_YEARS: lastNPeriods(3, "years"),
    LAST_5_YEARS: lastNPeriods(5, "years"),
    THIS_QUARTER: lastNPeriods(0, "quarters"),
    LAST_QUARTER: lastNPeriods(1, "quarters"),
    LAST_2_QUARTERS: lastNPeriods(2, "quarters"),
    LAST_3_QUARTERS: lastNPeriods(3, "quarters"),
    LAST_4_QUARTERS: lastNPeriods(4, "quarters"),
    QUARTERS_THIS_YEAR: lastNPeriods(moment().quarter() - 1, "quarters", true),
  };

  return relativePeriods[periodString];
};

// console.log(getRelativePeriods("LAST_4_WEEKS"));

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
  { label: "Period", value: "m5D13FqKZwN" },
  { label: "Program Indicator", value: "Eep3rko7uh6" },
  { label: "Indicator", value: "JRDOr08JWSW" },
  { label: "Organisation Group", value: "of2WvtwqbHR" },
  { label: "Organisation Level", value: "GQhi6pRnTKF" },
  { label: "Organisation", value: "mclvD0Z9mfT" },
  { label: "Data Element", value: "h9oh0VhweQM" },
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
      return all.map((s) => s.replace("${", "").replace("}", ""));
    }
  }
  return [];
};
