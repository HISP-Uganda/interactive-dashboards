import {
  Box,
  Button, Checkbox, FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, Select, Spinner,
  Stack, Textarea, useDisclosure
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useStore } from "effector-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-location";
import { IDashboard } from "../interfaces";
import { useNamespace } from "../Queries";
import { $store } from "../Store";

const NewCategoryDialog = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const store = useStore($store);
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, data, error } =
    useNamespace("i-categories");
  const engine = useDataEngine();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<IDashboard, any>({ defaultValues: store.dashboard });

  const add = async (values: IDashboard) => {
    const mutation: any = {
      type: "create",
      resource: `dataStore/i-dashboards/${values.id}`,
      data: values,
    };
    await engine.mutate(mutation);
  };
  async function onSubmit(values: any) {
    await add({ ...values, sections: [], filters: [] });
    onClose();
    navigate({ to: `/dashboards/${values.id}` });
  }
  return (
    <Box>
      {isLoading && <Spinner />}
      {isSuccess && (
        <>
          <Button onClick={onOpen}>Add Dashboard</Button>
          <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader>Adding Dashboard</ModalHeader>
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
                      <FormLabel htmlFor="name">Category</FormLabel>
                      <Select
                        id="category"
                        placeholder="Select Category"
                        {...register("category", {
                          required: "This is required",
                        })}
                      >
                        {Object.values(data)
                          .filter((i: any) => !!i.id)
                          .map((item: any) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </Select>
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
                      <Textarea
                        id="description"
                        placeholder="description"
                        {...register("description")}
                      />
                      <FormErrorMessage>
                        {errors.name && errors.name.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.description}>
                      <Checkbox id="isDefault" {...register("isDefault")}>
                        Default Dashboard
                      </Checkbox>
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
        </>
      )}

      {isError && <Box>{error.message}</Box>}
    </Box>
  );
};

export default NewCategoryDialog;
