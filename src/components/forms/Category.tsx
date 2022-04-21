import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Box,
  Textarea,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";

import { useStore } from "effector-react";
import { addCategory } from "../../Events";
import { ICategory } from "../../interfaces";
import { $category } from "../../Store";
import { useNavigate } from "@tanstack/react-location";

const Category = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const engine = useDataEngine();
  const category = useStore($category);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ICategory, any>({ defaultValues: category });

  const add = async (values: ICategory) => {
    const mutation: any = {
      type: "create",
      resource: `dataStore/i-categories/${values.id}`,
      data: values,
    };
    await engine.mutate(mutation);
    addCategory(values.id);
    queryClient.setQueryData(["categories"], (old: any) => [...old, values]);
  };
  async function onSubmit(values: any) {
    await add(values);
    navigate({ to: "/categories" });
  }
  return (
    <Box flex={1} p="10px">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="10px">
          <FormControl isInvalid={!!errors.id}>
            <Input id="id" type="hidden" placeholder="id" {...register("id")} />
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
          <Stack spacing="30px" direction="row">
            <Button colorScheme="red">Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Category
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default Category;
