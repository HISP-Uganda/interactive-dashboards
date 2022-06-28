import { Box, Button, Spacer, Stack, useDisclosure } from "@chakra-ui/react";
import { PeriodDimension } from "@dhis2/analytics";
import React from "react";
import useOnClickOutside from "use-onclickoutside";
import { Item, PickerProps } from "../interfaces";



const PeriodPicker = ({ selectedPeriods, onChange }: PickerProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const ref = React.useRef(null);
  useOnClickOutside(ref, onClose);

  const [availablePeriods, setAvailablePeriods] =
    React.useState<Item[]>(selectedPeriods);
  return (
    <Stack position="relative">
      <Button size="sm" onClick={onToggle}>
        Select Period
      </Button>
      {isOpen && (
        <Box bottom={0} top={7} zIndex={1000} position="absolute" right={-35}>
          <PeriodDimension
            onSelect={({
              items,
            }: {
              items: { id: string; name: string }[];
            }) => {
              setAvailablePeriods(items);
            }}
            selectedPeriods={availablePeriods}
          />
          <Stack direction="row" mt="10px">
            <Spacer />
            <Button
              onClick={() => {
                onChange(availablePeriods);
                onClose();
              }}
            >
              Update
            </Button>
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

export default PeriodPicker;
