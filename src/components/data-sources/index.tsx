import { IndicatorProps } from "../../interfaces";
import DHIS2 from "./DHIS2";
interface DHIS2Props extends IndicatorProps {
  dataSourceType?: string;
}
export const displayDataSourceType = ({
  denNum,
  onChange,
  dataSourceType,
}: DHIS2Props) => {
  const allTypes: { [key: string]: any } = {
    DHIS2: <DHIS2 denNum={denNum} onChange={onChange} />,
  };
  if (dataSourceType) {
    return allTypes[dataSourceType] || null;
  }
  return null;
};
