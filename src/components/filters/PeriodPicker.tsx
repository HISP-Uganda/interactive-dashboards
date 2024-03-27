import { Box, Button, Stack, Text, useDisclosure } from "@chakra-ui/react";

const PeriodPicker = () => {
    const { isOpen, onToggle } = useDisclosure();
    return (
        <Stack position="relative" flex={1}>
            <Button
                onClick={onToggle}
                w="300px"
                size="sm"
                variant="outline"
                _hover={{ backgroundColor: "none" }}
            >
                <Text>Period</Text>
            </Button>

            {isOpen && (
                <Stack
                    position="absolute"
                    top="48px"
                    backgroundColor="white"
                    boxShadow="xl"
                    minW="800px"
                    minH="660px"
                    maxH="660px"
                    // left="2px"
                    // right={0}
                >
                    <Box px="5px" alignSelf="flex-end" mb="-5px">
                        <Button
                            onClick={() => {
                                onToggle();
                            }}
                        >
                            Update
                        </Button>
                    </Box>
                </Stack>
            )}
        </Stack>
    );
};

export default PeriodPicker;
