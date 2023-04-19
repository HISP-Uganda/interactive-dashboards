import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Select,
    Spacer,
    Stack,
    Textarea,
} from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "effector-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { setDataSource } from "../../Events";
import { IDataSource, LocationGenerics } from "../../interfaces";
import { saveDocument } from "../../Queries";
import { $dataSource, $store, createDataSource, $settings } from "../../Store";
import { generalPadding, otherHeight } from "../constants";
import { useDataEngine } from "@dhis2/app-runtime";

const DataSource = () => {
    const navigate = useNavigate();
    const { action } = useSearch<LocationGenerics>();
    const queryClient = useQueryClient();
    const dataSource = useStore($dataSource);
    const store = useStore($store);
    const engine = useDataEngine();
    const { storage } = useStore($settings);
    const {
        handleSubmit,
        register,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<IDataSource, any>({
        defaultValues: dataSource,
    });

    const type = watch("type");
    const isCurrentDHIS2 = watch("isCurrentDHIS2");

    const add = async (values: IDataSource) => {
        await saveDocument(
            storage,
            "i-data-sources",
            store.systemId,
            values,
            engine,
            action || "create"
        );
        await queryClient.invalidateQueries(["data-sources"]);
    };
    async function onSubmit(values: any) {
        await add(values);
        navigate({ to: "/settings/data-sources" });
    }

    useEffect(() => {
        if (type !== "DHIS2" && isCurrentDHIS2) {
            setValue("isCurrentDHIS2", false);
        }
    }, [type]);

    useEffect(() => {
        if (isCurrentDHIS2) {
            setValue("name", store.systemName);
            setValue("description", store.systemName);
            setValue("authentication.url", store.instanceBaseUrl);
        }
    }, [isCurrentDHIS2]);

    return (
        <Box
            p={`${generalPadding}px`}
            bgColor="white"
            flex={1}
            h={otherHeight}
            maxH={otherHeight}
            w="100%"
        >
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
                            {errors.id && errors.id.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.type} isRequired={true}>
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
                            {errors.type && errors.type.message}
                        </FormErrorMessage>
                    </FormControl>
                    {type === "DHIS2" && (
                        <FormControl
                            isInvalid={!!errors.isCurrentDHIS2}
                            isRequired={false}
                        >
                            <Checkbox
                                {...register("isCurrentDHIS2")}
                                colorScheme="green"
                            >
                                Is Current DHIS2
                            </Checkbox>
                            <FormErrorMessage>
                                {errors.isCurrentDHIS2 &&
                                    errors.isCurrentDHIS2.message}
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
                            <FormControl
                                isInvalid={!!errors.authentication?.url}
                            >
                                <FormLabel htmlFor="authentication.url">
                                    URL
                                </FormLabel>
                                <Input
                                    id="authentication.url"
                                    placeholder="url"
                                    {...register("authentication.url")}
                                />
                                <FormErrorMessage>
                                    {errors.authentication?.url?.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl
                                isInvalid={!!errors.authentication?.username}
                            >
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

                            <FormControl
                                isInvalid={!!errors.authentication?.password}
                            >
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
                    <Stack spacing="30px" direction="row">
                        <Button
                            colorScheme="red"
                            onClick={() => {
                                setDataSource(createDataSource());
                                navigate({ to: "/settings/data-sources" });
                            }}
                        >
                            Cancel
                        </Button>
                        <Spacer />
                        <Button type="submit" isLoading={isSubmitting}>
                            Save Data Source
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Box>
    );
};

export default DataSource;
