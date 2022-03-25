import DHIS2 from "./DHIS2";

export const displayDataSourceType = (dataSourceType: string | undefined) => {
  const allTypes: { [key: string]: any } = {
    DHIS2: <DHIS2 />,
  };
  if (dataSourceType) {
    return allTypes[dataSourceType] || null;
  }
  return null;
};
