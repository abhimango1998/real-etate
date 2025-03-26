import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'

const TablePaginationComponent = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
      <Typography color='text.disabled'>{`Showing ${startItem} to ${endItem} of ${totalItems} entries`}</Typography>
      <Pagination
        shape='rounded'
        color='primary'
        variant='tonal'
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => {
          onPageChange(page)
        }}
        showFirstButton
        showLastButton
      />
    </div>
  )
}

export default TablePaginationComponent
