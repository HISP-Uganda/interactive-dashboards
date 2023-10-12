import {
    Pagination,
    PaginationContainer,
    PaginationNext,
    PaginationPage,
    PaginationPageGroup,
    PaginationPrevious,
    PaginationSeparator,
    usePagination,
} from "@ajna/pagination";
import { Stack, Text } from "@chakra-ui/react";
import React, { ChangeEvent } from "react";
interface Props {
    total: number;
    currentPage: number;
    setNextPage(page: number): void;
    pageSize: number;
}

export default function ({ currentPage, setNextPage, total, pageSize }: Props) {
    const { pages, pagesCount, setCurrentPage, setIsDisabled, setPageSize } =
        usePagination({
            total,
            limits: {
                outer: 4,
                inner: 4,
            },
            initialState: {
                pageSize,
                isDisabled: false,
                currentPage,
            },
        });
    const handlePageChange = (nextPage: number): void => {
        setCurrentPage(nextPage);
        setNextPage(nextPage);
    };

    const handlePageSizeChange = (
        event: ChangeEvent<HTMLSelectElement>
    ): void => {
        const pageSize = Number(event.target.value);
        setPageSize(pageSize);
    };

    const handleDisableClick = (): void => {
        setIsDisabled((oldState) => !oldState);
    };
    return (
        <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
        >
            <PaginationContainer
                align="center"
                justify="space-between"
                p={4}
                w="full"
            >
                <PaginationPrevious
                    _hover={{
                        bg: "yellow.400",
                    }}
                    bgColor="yellow.300"
                    size="sm"
                >
                    <Text>Previous</Text>
                </PaginationPrevious>
                <PaginationPageGroup
                    isInline
                    align="center"
                    separator={
                        <PaginationSeparator
                            bgColor="blue.300"
                            fontSize="sm"
                            w={14}
                            jumpSize={11}
                        />
                    }
                >
                    {pages.map((page: number) => (
                        <PaginationPage
                            minW={14}
                            key={`pagination_page_${page}`}
                            page={page}
                            fontSize="sm"
                            _hover={{
                                bg: "green.300",
                            }}
                            _current={{
                                bg: "green.300",
                                fontSize: "sm",
                                w: 14,
                            }}
                            size="sm"
                        />
                    ))}
                </PaginationPageGroup>
                <PaginationNext
                    _hover={{
                        bg: "yellow.400",
                    }}
                    bgColor="yellow.300"
                    size="sm"
                >
                    <Text>Next</Text>
                </PaginationNext>
            </PaginationContainer>
        </Pagination>
    );
}
