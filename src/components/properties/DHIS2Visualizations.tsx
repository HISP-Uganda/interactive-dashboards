import { Input, Stack, Table, Tbody, Th, Tr } from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { ChangeEvent, useState } from "react";
import { useInView } from "react-intersection-observer";
import { sectionApi } from "../../Events";
import { IDataSource, INamed, IVisualization } from "../../interfaces";
import { getDHIS2Resources2 } from "../../Queries";
import Scrollable from "../Scrollable";

export default function DHIS2Visualizations({
    dataSource,
    visualization,
}: {
    dataSource: IDataSource;
    visualization: IVisualization;
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
                totalPages: number;
            };
            data: Array<INamed & { type: string }>;
        },
        Error
    >(
        ["projects", search],
        async ({ pageParam = 1 }) => {
            let params: { [key: string]: any } = {
                fields: "id,name,type",
                page: pageParam,
            };
            if (search) {
                params = { ...params, filter: `identifiable:token:${search}` };
            }
            const data = await getDHIS2Resources2<INamed & { type: string }>({
                resource: "visualizations",
                params,
                engine,
            });
            return data;
        },
        {
            getPreviousPageParam: (firstPage) =>
                firstPage.pager.page ?? undefined,
            getNextPageParam: (lastPage) => lastPage.pager.page + 1,
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
                <Scrollable height={300}>
                    <Table size="md">
                        <Tr>
                            <Th>Name</Th>
                        </Tr>
                        <Tbody>
                            {data?.pages.map((page) => (
                                <React.Fragment key={page.pager.page}>
                                    {page.data.map((d) => (
                                        <Tr
                                            key={d.id}
                                            bg={
                                                visualization.properties[
                                                    "visualization"
                                                ] === d.id
                                                    ? "gray.400"
                                                    : ""
                                            }
                                            onClick={() =>
                                                sectionApi.changeVisualizationProperties(
                                                    {
                                                        visualization:
                                                            visualization.id,
                                                        attribute:
                                                            "visualization",
                                                        value: d.id,
                                                    }
                                                )
                                            }
                                            cursor="pointer"
                                        >
                                            <Th>{d.name}</Th>
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
