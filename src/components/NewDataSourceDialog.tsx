import {
  Box,
  Button,
  Checkbox,
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
  Select,
  Stack,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { addDataSource } from "../Events";
import { IDataSource } from "../interfaces";
import { generateUid } from "../utils/uid";

const NewDataSourceDialog = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const engine = useDataEngine();
  const defaultValues: IDataSource = {
    id: generateUid(),
    name: "",
    type: "DHIS2",
    isCurrentDHIS2: true,
    authentication: { username: "", password: "", url: "" },
  };
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IDataSource, any>({ defaultValues });

  const type = watch("type");
  const isCurrentDHIS2 = watch("isCurrentDHIS2");

  const add = async (values: IDataSource) => {
    const mutation: any = {
      type: "create",
      resource: `dataStore/i-data-sources/${values.id}`,
      data: values,
    };
    await engine.mutate(mutation);
    addDataSource(values.id);
    queryClient.setQueryData(["namespaces", "i-data-sources"], (old: any) => [
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
      <Button onClick={onOpen}>Add Data Source</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Adding Data Source</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing="20px">
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
                  <FormLabel htmlFor="type">Data Source Type</FormLabel>
                  <Select
                    id="type"
                    placeholder="Data Source Type"
                    {...register("type", {
                      required: "This is required",
                    })}
                  >
                    <option value="DHIS2">DHIS2</option>
                    <option value="ELASTICSEARCH">Elasticsearch</option>
                    <option value="API">API</option>
                  </Select>
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>
                {type === "DHIS2" && (
                  <FormControl isInvalid={!!errors.name} isRequired={true}>
                    <Checkbox
                      {...register("isCurrentDHIS2")}
                      colorScheme="green"
                    >
                      Is Current DHIS2
                    </Checkbox>
                    <FormErrorMessage>
                      {errors.isCurrentDHIS2 && errors.isCurrentDHIS2.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
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

                {!isCurrentDHIS2 && (
                  <>
                    <FormControl isInvalid={!!errors.authentication?.url}>
                      <FormLabel htmlFor="authentication.url">URL</FormLabel>
                      <Input
                        id="authentication.url"
                        placeholder="url"
                        {...register("authentication.url")}
                      />
                      <FormErrorMessage>
                        {errors.authentication?.url?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.authentication?.username}>
                      <FormLabel htmlFor="authentication.username">
                        Username
                      </FormLabel>
                      <Input
                        id="authentication.username"
                        placeholder="username"
                        {...register("authentication.username")}
                      />
                      <FormErrorMessage>
                        {errors.authentication?.username?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.authentication?.password}>
                      <FormLabel htmlFor="authentication.password">
                        Password
                      </FormLabel>
                      <Input
                        id="authentication.password"
                        placeholder="password"
                        {...register("authentication.password")}
                      />
                      <FormErrorMessage>
                        {errors.authentication?.password?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </>
                )}

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
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Stack spacing="30px" direction="row">
                <Button onClick={onClose} colorScheme="red">
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Add Data Source
                </Button>
              </Stack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default NewDataSourceDialog;
