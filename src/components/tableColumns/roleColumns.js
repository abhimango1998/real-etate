import { IconButton } from '@mui/material'
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper()

export const rolesColumns = ({
  setSelectedPermission,
  setPermissionsModalOpen,
  handleEdit,
  handleDelete,
  hasUpdatePermission,
  hasDeletePermission
}) => [
  columnHelper.accessor('id', {
    cell: info => info.getValue(),
    header: 'Id'
  }),
  columnHelper.accessor('name', {
    cell: info => info.getValue(),
    header: 'Name'
  }),
  columnHelper.accessor('permissions', {
    cell: info => {
      const permissions = info.getValue()

      return (
        <IconButton
          onClick={() => {
            setSelectedPermission(permissions)
            setPermissionsModalOpen(true)
          }}
        >
          <i className='tabler-user-cog' />
        </IconButton>
      )
    },
    header: 'Permissions'
  }),
  columnHelper.accessor('actions', {
    cell: info => {
      const role = info.row.original

      return (
        <div className='flex gap-2'>
          <IconButton
            disabled={role?.name === 'superadmin' || !hasUpdatePermission}
            color='primary'
            onClick={() => handleEdit(info.row.original)}
            size='small'
          >
            <i className='tabler-edit text-blue-500' style={{ fontSize: '1.25rem' }} />
          </IconButton>
          <IconButton
            disabled={role?.name === 'superadmin' || !hasDeletePermission}
            color='error'
            onClick={() => handleDelete(info.row.original.id)}
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
