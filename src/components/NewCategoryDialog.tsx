import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";

import { addCategory } from "../Events";
import { ICategory } from "../interfaces";
import { generateUid } from "../utils/uid";

const NewCategoryDialog = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const engine = useDataEngine();
  const defaultValues: ICategory = {
    id: generateUid(),
    name: "",
  };
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ICategory, any>({ defaultValues });

  const add = async (values: ICategory) => {
    const mutation: any = {
      type: "create",
      resource: `dataStore/i-categories/${values.id}`,
      data: values,
    };
    await engine.mutate(mutation);
    addCategory(values.id);
    queryClient.setQueryData(["namespaces", "i-categories"], (old: any) => [
      ...old,
      values,
    ]);
  };
  async function onSubmit(values: any) {
    await add(values);
    onClose();
  }
  return (
    <Box>
      <Button onClick={onOpen}>Add Category</Button>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Adding Category</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing="10px">
                <FormControl isInvalid={!!errors.id}>
                  <Input
                    id="id"
                    type="hidden"
                    placeholder="id"
                    {...register("id")}
                  />
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.name} isRequired={true}>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    id="name"
                    placeholder="name"
                    {...register("name", {
                      required: "This is required",
                      minLength: {
                        value: 3,
                        message: "Minimum length should be 4",
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.description}>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <Input
                    id="description"
                    placeholder="description"
                    {...register("description")}
                  />
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Stack spacing="30px" direction="row">
                <Button onClick={onClose} colorScheme="red">
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Save Category
                </Button>
              </Stack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default NewCategoryDialog;
