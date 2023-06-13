import {
    Box,
    Button,
    Checkbox,
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
import { Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { dataSourceApi } from "../../Events";
import { IDataSource, LocationGenerics, Option } from "../../interfaces";
import { saveDocument } from "../../Queries";
import { $dataSource, $settings, $store, createDataSource } from "../../Store";
import { generalPadding, otherHeight } from "../constants";

const dataSourceTypes: Option[] = [
    { label: "DHIS2", value: "DHIS2" },
    { label: "Elasticsearch", value: "ELASTICSEARCH" },
    { label: "API", value: "API" },
    { label: "Index DB", value: "INDEX_DB" },
];

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
        control,
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
                        <Controller
                            name="type"
                            control={control}
                            render={({
                                field: { value, onChange, ...others },
                            }) => {
                                return (
                                    <Select
                                        {...others}
                                        isClearable
                                        options={dataSourceTypes}
                                        placeholder={"Choose..."}
                                        onChange={(currentValue) => {
                                            if (currentValue) {
                                                onChange(currentValue.value);
                                            } else {
                                                onChange(null);
                                            }
                                        }}
                                        value={dataSourceTypes.find(
                                            (option: {
                                                value: string;
                                                label: string;
                                            }) => {
                                                if (value) {
                                                    return value?.includes(
                                                        option.value
                                                    );
                                                }
                                                return false;
                                            }
                                        )}
                                        defaultValue={dataSourceTypes.find(
                                            (option: {
                                                value: string;
                                                label: string;
                                            }) => {
                                                if (value) {
                                                    return value?.includes(
                                                        option.value
                                                    );
                                                }
                                                return false;
                                            }
                                        )}
                                    />
                                );
                            }}
                        />
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

                    {!isCurrentDHIS2 &&
                        ["API", "ELASTICSEARCH"].indexOf(type) !== -1 && (
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
                                    isInvalid={
                                        !!errors.authentication?.username
                                    }
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
                                        {
                                            errors.authentication?.username
                                                ?.message
                                        }
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    isInvalid={
                                        !!errors.authentication?.password
                                    }
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
                                        {
                                            errors.authentication?.password
                                                ?.message
                                        }
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

                    {type === "INDEX_DB" && (
                        <FormControl isInvalid={!!errors.indexDb}>
                            <FormLabel htmlFor="indexDb.programStage">
                                Program Stage
                            </FormLabel>
                            <Input
                                id="indexDb.programStage"
                                {...register("indexDb.programStage")}
                            />
                            <FormErrorMessage>
                                {errors.indexDb && errors.indexDb.message}
                            </FormErrorMessage>
                        </FormControl>
                    )}
                    <Stack spacing="30px" direction="row">
                        <Button
                            colorScheme="red"
                            onClick={() => {
                                dataSourceApi.setDataSource(createDataSource());
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
