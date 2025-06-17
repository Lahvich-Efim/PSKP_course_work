import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationBarProps {
    page: number;
    totalPages: number;
    setPage: (page: (prev: number) => number) => void;
}

export function PaginationBar({
    page,
    totalPages,
    setPage,
}: PaginationBarProps) {
    const renderPages = () => {
        const items = [];

        for (let index = 0; index < totalPages; index++) {
            const pageNum = index + 1;
            const isCurrent = page === index;

            if (
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - (page + 1)) <= 1
            ) {
                items.push(
                    <PaginationItem key={index}>
                        <PaginationLink
                            href="#"
                            isActive={isCurrent}
                            onClick={() => setPage((index) => index)}
                        >
                            {pageNum}
                        </PaginationLink>
                    </PaginationItem>,
                );
            } else if (pageNum === 2 && page > 2) {
                items.push(
                    <PaginationItem key="start-ellipsis">
                        <span className="px-2">...</span>
                    </PaginationItem>,
                );
            } else if (pageNum === totalPages - 1 && page < totalPages - 3) {
                items.push(
                    <PaginationItem key="end-ellipsis">
                        <span className="px-2">...</span>
                    </PaginationItem>,
                );
            }
        }

        return items;
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        isActive={page !== 0}
                    />
                </PaginationItem>

                {renderPages()}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        isActive={page !== totalPages - 1}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
