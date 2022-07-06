import { Option } from "../../interfaces";
export const createOptions = (options: string[]): Option[] => {
  return options.map((option: string) => {
    return { label: option, value: option };
  });
};
