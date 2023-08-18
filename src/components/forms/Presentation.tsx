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
import { useForm, Controller } from "react-hook-form";
import { presentationApi } from "../../Events";
import { IPresentation, LocationGenerics } from "../../interfaces";
import { saveDocument } from "../../Queries";
import {
    $presentation,
    $settings,
    $store,
    createPresentation,
} from "../../Store";
import DashboardTreeCheck from "../DashboardTreeCheck";
export default function Presentation() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const presentation = useStore($presentation);
    const store = useStore($store);
    const engine = useDataEngine();
    const { storage } = useStore($settings);
    const search = useSearch<LocationGenerics>();
    const {
        handleSubmit,
        register,
        control,
        formState: { errors, isSubmitting },
    } = useForm<IPresentation, any>({ defaultValues: presentation });

    const add = async (values: IPresentation) => {
        await saveDocument(
            storage,
            "i-presentations",
            store.systemId,
            values,
            engine,
            search.action || "create"
        );
        await queryClient.invalidateQueries(["presentations"]);
    };
    async function onSubmit(values: any) {
        await add(values);
        navigate({ to: "/settings/presentations" });
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
                    <Controller
                        control={control}
                        name="items"
                        render={({
                            field: { onChange, onBlur, value, ref },
                        }) => (
                            <DashboardTreeCheck
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                    <Stack spacing="30px" direction="row">
                        <Button
                            colorScheme="red"
                            onClick={() => {
                                presentationApi.setPresentation(
                                    createPresentation()
                                );
                                navigate({ to: "/settings/presentations" });
                            }}
                        >
                            Cancel
                        </Button>
                        <Spacer />
                        <Button type="submit" isLoading={isSubmitting}>
                            Save Presentation
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Box>
    );
}
