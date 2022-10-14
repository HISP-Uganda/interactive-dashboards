import { Box, Spinner } from "@chakra-ui/react";
import { useStore } from "effector-react";
import React from "react";
import { onChangeOrganisations } from "../Events";
import { useOrganisationUnits } from "../Queries";
import { $store } from "../Store";
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
