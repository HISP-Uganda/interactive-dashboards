import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Spacer,
    Stack,
    Textarea,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "effector-react";
import { useForm } from "react-hook-form";
import { setCategory } from "../../Events";
import { ICategory, LocationGenerics } from "../../interfaces";
import { saveDocument } from "../../Queries";
import { $category, $settings, $store, createCategory } from "../../Store";

const Category = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const category = useStore($category);
    const store = useStore($store);
    const engine = useDataEngine();
    const { storage } = useStore($settings);
    const search = useSearch<LocationGenerics>();
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<ICategory, any>({ defaultValues: category });

    const add = async (values: ICategory) => {
        await saveDocument(
            storage,
            "i-categories",
            store.systemId,
            values,
            engine,
            search.action || "create"
        );
        await queryClient.invalidateQueries(["categories"]);
    };
    async function onSubmit(values: any) {
        await add(values);
        navigate({ to: "/settings/categories" });
    }
    return (
        <Box flex={1} p="20px" bgColor="white" w="100%">
            <form onSubmit={handleSubmit(onSubmit)}>
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
                                navigate({ to: "/settings/categories" });
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
