import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import CatalogsList from '@/components/CatalogsList.tsx';

interface PaginationBarProps {
    page: number;
    totalPages: number;
    onChangePage: (newPage: number) => void;
}

const PaginationBar = ({
    page,
    totalPages,
    onChangePage,
}: PaginationBarProps) => {
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
                            onClick={() => onChangePage(index)}
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
                        onClick={() => onChangePage(Math.max(page - 1, 0))}
                        isActive={page > 0}
                    />
                </PaginationItem>

                {renderPages()}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={() =>
                            onChangePage(Math.min(page + 1, totalPages - 1))
                        }
                        isActive={page < totalPages - 1}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationBar;
