import { Box, Spinner } from "@chakra-ui/react";
import { useOrganisationUnits } from "../Queries";
import OUTree from "./OUTree";

const OUTreeSelect = ({
  value,
  onChange,
}: {
  value: string | string[] | undefined;
  onChange: (value: string | string[] | undefined) => void;
}) => {
  const { isLoading, isSuccess, isError, error, data } = useOrganisationUnits();
  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && data && (
        <OUTree {...data} onChange={onChange} value={value} />
      )}
      {isError && <Box>{error?.message}</Box>}
    </>
  );
};

export default OUTreeSelect;
