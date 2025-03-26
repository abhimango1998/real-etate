import { createColumnHelper } from '@tanstack/react-table'
import { IconButton } from '@mui/material'

const columnHelper = createColumnHelper()

export const usersColumns = ({ hasUpdatePermission, hasDeletePermission, handleEdit, handleDelete }) => [
  columnHelper.accessor('id', {
    cell: info => info.getValue(),
    header: 'Id'
  }),
  columnHelper.accessor('name', {
    cell: info => info.getValue(),
    header: 'Name'
  }),
  columnHelper.accessor('email', {
    cell: info => info.getValue(),
    header: 'Email'
  }),
  columnHelper.accessor('role', {
    cell: info => info.getValue(),
    header: 'Role'
  }),
  columnHelper.accessor('actions', {
    cell: info => {
      const user = info.row.original

      return (
        <div className='flex gap-2'>
          <IconButton
            disabled={user?.role === 'superadmin' || !hasUpdatePermission}
            color='primary'
            onClick={() => handleEdit(user)}
            size='small'
          >
            <i className='tabler-edit text-blue-500' style={{ fontSize: '1.25rem' }} />
          </IconButton>
          <IconButton
            disabled={user?.role === 'superadmin' || !hasDeletePermission}
            color='error'
            onClick={() => handleDelete(user.id)}
            size='small'
          >
            <i className='tabler-trash text-red-500' style={{ fontSize: '1.25rem' }} />
          </IconButton>
        </div>
      )
    },
    header: 'Actions'
  })
]
