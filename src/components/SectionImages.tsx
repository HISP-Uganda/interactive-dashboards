import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
    IconButton,
    Image,
    Spacer,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { useRef, ChangeEvent } from "react";
import { changeSectionAttribute } from "../Events";
import { $section } from "../Store";
import { generateUid } from "../utils/uid";

export default function () {
    const ref = useRef(null);
    const section = useStore($section);
    const addImage = (src: string) => {
        changeSectionAttribute({
            attribute: "images",
            value: [
                ...section.images,
                {
                    id: generateUid(),
                    src,
                },
            ],
        });
    };
    const removeImage = (imageId: string) => {
        changeSectionAttribute({
            attribute: "images",
            value: section.images.filter(({ id }) => id !== imageId),
        });
    };

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        let fileReader;
        let isCancel = false;
        if (file) {
            fileReader = new FileReader();
            fileReader.onload = (f: any) => {
                const { result } = f.target;
                if (result && !isCancel) {
                    addImage(result);
                }
            };
            fileReader.readAsDataURL(file);
        }
    };

    return (
        <Stack>
            <Stack direction="row" alignItems="center">
                <Text>Threshold</Text>
                <Spacer />
                <input
                    type="file"
                    id="image"
                    accept=".png, .jpg, .jpeg"
                    onChange={changeHandler}
                />
            </Stack>
            <TableContainer>
                <Table variant="simple" size="xs">
                    <Thead>
                        <Tr>
                            <Th>Image</Th>
                            <Th>Alignment</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody ref={ref}>
                        {section.images.map(({ id, src }) => (
                            <Tr key={id}>
                                <Td w="60%">
                                    <Image src={src} maxH="45px" />
                                </Td>
                                <Td w="30%"></Td>
                                <Td textAlign="right" w="10%">
                                    <IconButton
                                        aria-label="delete"
                                        bgColor="none"
                                        icon={<DeleteIcon w={3} h={3} />}
                                        onClick={() => removeImage(id)}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Stack>
    );
}
