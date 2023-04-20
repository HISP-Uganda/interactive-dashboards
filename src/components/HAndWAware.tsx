import { Image, Stack, StackProps } from "@chakra-ui/react";
import { useElementSize } from "usehooks-ts";

interface HAndWAwareProps extends StackProps {
    src: string;
    minusH: number;
    minusW: number;
}

const HAndWAware = ({ src, minusH, minusW, ...rest }: HAndWAwareProps) => {
    const [squareRef, { width, height }] = useElementSize();
    return (
        <Stack
            ref={squareRef}
            h="100%"
            w="100%"
            alignItems="center"
            justifyItems="center"
            justifyContent="center"
            alignContent="center"
            flex={1}
            {...rest}
        >
            <Image
                maxH={`${height - minusH}px`}
                src={src}
                maxW={`${width - minusW}px`}
            />
        </Stack>
    );
};

export default HAndWAware;
