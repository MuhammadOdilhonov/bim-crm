"use client"

import { useState, useEffect } from "react"
import ReactPaginate from "react-paginate"

const Pagination = ({ itemsPerPage, totalItems, currentPage, onPageChange }) => {
    const [pageCount, setPageCount] = useState(0)

    useEffect(() => {
        setPageCount(Math.ceil(totalItems / itemsPerPage))
    }, [totalItems, itemsPerPage])

    // Invoke when user click to request another page
    const handlePageClick = (event) => {
        onPageChange(event.selected)
    }

    return (
        <div className="pagination-container">
            <ReactPaginate
                breakLabel="..."
                nextLabel="→"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageCount={pageCount}
                previousLabel="←"
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                pageLinkClassName="pagination-link"
                previousLinkClassName="pagination-link"
                nextLinkClassName="pagination-link"
                breakLinkClassName="pagination-link"
                activeLinkClassName="active"
                disabledLinkClassName="disabled"
                forcePage={currentPage}
            />
            <div className="pagination-info">
                Ko'rsatilmoqda {currentPage * itemsPerPage + 1} - {Math.min((currentPage + 1) * itemsPerPage, totalItems)} /{" "}
                {totalItems}
            </div>
        </div>
    )
}

export default Pagination
