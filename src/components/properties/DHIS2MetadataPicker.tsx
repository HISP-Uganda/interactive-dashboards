import {
    Checkbox,
    Input,
    Stack,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { ChangeEvent, useState } from "react";
import { useInView } from "react-intersection-observer";
import { INamed } from "../../interfaces";
import { getDHIS2Resources2 } from "../../Queries";
import Scrollable from "../Scrollable";

export default function DHIS2MetadataPicker<T extends INamed>({
    resource,
    fields = "id,name",
    filter,
    list,
    callback,
    valueField,
}: {
    resource: string;
    fields?: string;
    filter?: string;
    callback: (id: any, value: boolean) => void;
    list: string[];
    valueField: keyof T;
}) {
    const { ref, inView } = useInView();
    const engine = useDataEngine();

    const [search, setSearch] = useState<string | null | undefined>();
    const [q, setQ] = useState<string>("");
    const {
        status,
        data,
        error,
        isFetching,
        isFetchingNextPage,
        isFetchingPreviousPage,
        fetchNextPage,
        fetchPreviousPage,
        hasNextPage,
        hasPreviousPage,
    } = useInfiniteQuery<
        {
            pager: {
                total: number;
                page: number;
                pageSize: number;
                pageCount: number;
            };
            data: Array<T>;
        },
        Error
    >(
        ["projects", search],
        async ({ pageParam = 1 }) => {
            let params: { [key: string]: any } = { page: pageParam, fields };
            let filters: string[] = [];
            if (filter) {
                filters = [...filters, filter];
            }
            if (search) {
                filters = [...filters, `identifiable:token:${search}`];
            }

            if (filters.length > 0) {
                params = { ...params, filter: filters };
            }
            const data = await getDHIS2Resources2<T>({
                resource,
                params,
                engine,
            });
            return data;
        },
        {
            getPreviousPageParam: (firstPage) =>
                firstPage.pager.page ?? undefined,
            getNextPageParam: (lastPage) => {
                if (lastPage.pager.page < lastPage.pager.pageCount) {
                    return lastPage.pager.page + 1;
                }
                return undefined;
            },
        }
    );
    React.useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);
    return (
        <Stack>
            <Input
                size="sm"
                value={q}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setQ(e.target.value)
                }
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        setSearch(q);
                    }
                }}
            />
            {status === "loading" ? (
                <p>Loading...</p>
            ) : status === "error" ? (
                <span>Error: {error?.message}</span>
            ) : (
                <Scrollable height={"calc(100vh - 384px)"}>
                    <Table size="md">
                        <Thead>
                            <Tr>
                                <Th w="20px"></Th>
                                {fields
                                    .split(",")
                                    .filter((field) => field !== "id")
                                    .map((field) => (
                                        <Th key={field}>{field}</Th>
                                    ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data?.pages.map((page) => (
                                <React.Fragment key={page.pager.page}>
                                    {page.data.map((d) => (
                                        <Tr key={`${d.id}${page.pager.page}`}>
                                            <Td>
                                                <Checkbox
                                                    isChecked={
                                                        list.indexOf(
                                                            String(
                                                                d[valueField]
                                                            )
                                                        ) !== -1
                                                    }
                                                    onChange={(
                                                        e: ChangeEvent<HTMLInputElement>
                                                    ) =>
                                                        callback(
                                                            d[valueField],
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                            </Td>
                                            {fields
                                                .split(",")
                                                .filter(
                                                    (field) => field !== "id"
                                                )
                                                .map((field) => {
                                                    const val =
                                                        d[field as keyof T];
                                                    return (
                                                        <Td
                                                            key={`${d.id}${field}`}
                                                        >
                                                            {String(val)}
                                                        </Td>
                                                    );
                                                })}
                                        </Tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </Tbody>
                    </Table>

                    <div>
                        <button
                            ref={ref}
                            onClick={() => fetchNextPage()}
                            disabled={!hasNextPage || isFetchingNextPage}
                        >
                            {isFetchingNextPage
                                ? "Loading more..."
                                : hasNextPage
                                ? "Load Newer"
                                : "Nothing more to load"}
                        </button>
                    </div>
                    <div>
                        {isFetching && !isFetchingNextPage
                            ? "Background Updating..."
                            : null}
                    </div>
                </Scrollable>
            )}
        </Stack>
    );
}
