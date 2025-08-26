import React from 'react';

const Pagination = ({ pagination, queryParams, handlePageChange }) => {
  if (!pagination.totalPages || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageChange(queryParams.page - 1)}
        disabled={queryParams.page <= 1}
      >
        Previous
      </button>
      <span>
        Page {pagination.currentPage} of {pagination.totalPages}
      </span>
      <button
        onClick={() => handlePageChange(queryParams.page + 1)}
        disabled={queryParams.page >= pagination.totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;