'use client'
import {
    Pagination as UIPagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { buildPageNumbers, cn, ELLIPSIS } from "@/lib/utils";
import type { Pagination } from "@/type.d";
import { useRouter } from 'next/navigation';

const CoinPagination = ({ currentPage, totalPages, hasMorePages }: Pagination) => {

    const router = useRouter();

    const handlePageChange = (page: number) => {
        router.push(`/coins?page=${page}`);
    }

    const pageNumbers = buildPageNumbers(currentPage, totalPages);
	const isLastPage = !hasMorePages || currentPage === totalPages;
    return (
        <UIPagination id="coins-pagination" >
            <PaginationContent className="pagination-content">
                <PaginationItem className="pagination-control prev">
                    <PaginationPrevious className={currentPage === 1 ? 'control-disabled' : 'control-button'} href="#"
                        onClick={(e) => { e.preventDefault(); currentPage > 1 && handlePageChange(currentPage - 1); }} />
                </PaginationItem>

                <div className="pagination-pages">
                    {pageNumbers.map((page, index) => (
                         <PaginationItem key={index}>
                        { page === ELLIPSIS ? <span className="ellipsis">...</span> :
                           
                <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page); }} 
                                className={cn('page-link',{
                                    'page-link-active':currentPage === page
                                })}>{page}</PaginationLink>
                           
                        }
                         </PaginationItem>
                    ))}
                </div>

                <PaginationItem className="pagination-control next">
                    <PaginationNext className={isLastPage ? 'control-disabled' : 'control-button'} href="#"
                        onClick={(e) => { e.preventDefault(); !isLastPage && handlePageChange(currentPage + 1); }} />
                </PaginationItem>
            </PaginationContent>
        </UIPagination>
    )
}

export default CoinPagination