import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Box,
  Textarea,
  Spacer,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";

import { useStore } from "effector-react";
import { setCategory, setShowSider } from "../../Events";
import { FormGenerics, ICategory } from "../../interfaces";
import { $category, createCategory } from "../../Store";
import { useNavigate, useSearch } from "@tanstack/react-location";

const Category = () => {
  const search = useSearch<FormGenerics>();
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
    let mutation: any = {
      type: "create",
      resource: `dataStore/i-categories/${values.id}`,
      data: values,
    };

    if (search.edit) {
      mutation = {
        type: "update",
        resource: `dataStore/i-categories`,
        data: values,
        id: values.id,
      };
    }
    await engine.mutate(mutation);
    await queryClient.invalidateQueries(["categories"]);
  };
  async function onSubmit(values: any) {
    await add(values);
    navigate({ to: "/categories" });
  }
  useEffect(() => {
    setShowSider(true);
  }, []);
  return (
    <Box flex={1} p="10px">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="20px">
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
            <Button
              colorScheme="red"
              onClick={() => {
                setCategory(createCategory());
                navigate({ to: "/categories" });
              }}
            >
              Cancel
            </Button>
            <Spacer />
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
