import { Box, Spinner } from "@chakra-ui/react";
import { useOrganisationUnits } from "../Queries";
import OUTree from "./OUTree";

const OUTreeSelect = () => {
  const { isLoading, isSuccess, isError, error, data } = useOrganisationUnits();
  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && <OUTree {...data} />}
      {isError && <Box>{error.message}</Box>}
    </>
  );
};

export default OUTreeSelect;
