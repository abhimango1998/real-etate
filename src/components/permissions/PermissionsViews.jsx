'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import CardHeader from '@mui/material/CardHeader'

// Third-party Imports
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// Style Imports
import styles from '@core/styles/table.module.css'

// Column Definitions
const columnHelper = createColumnHelper()

const PermissionsViews = ({ permissions }) => {
  const [data, setData] = useState([])
  const [, setUniquePermissions] = useState([])

  useEffect(() => {
    if (permissions && permissions.length > 0) {
      const uniqueNames = [...new Set(permissions.map(p => p.permission_name))]

      setUniquePermissions(uniqueNames)

      const processedData = uniqueNames.map((name, index) => {
        const permsForName = permissions.filter(p => p.permission_name === name)

        return {
          id: index + 1,
          permission_name: name,
          read: permsForName.some(p => p.permission_type === 'get'),
          create: permsForName.some(p => p.permission_type === 'create'),
          update: permsForName.some(p => p.permission_type === 'update'),
          delete: permsForName.some(p => p.permission_type === 'delete')
        }
      })

      setData(processedData)
    }
  }, [permissions])

  const columns = [
    columnHelper.accessor('id', {
      cell: info => info.getValue(),
      header: '#'
    }),
    columnHelper.accessor('permission_name', {
      cell: info => info.getValue(),
      header: 'Permission'
    }),
    columnHelper.accessor('read', {
      cell: info => renderPermissionStatus(info.getValue()),
      header: 'Read'
    }),
    columnHelper.accessor('create', {
      cell: info => renderPermissionStatus(info.getValue()),
      header: 'Create'
    }),
    columnHelper.accessor('update', {
      cell: info => renderPermissionStatus(info.getValue()),
      header: 'Update'
    }),
    columnHelper.accessor('delete', {
      cell: info => renderPermissionStatus(info.getValue()),
      header: 'Delete'
    })
  ]

  const renderPermissionStatus = status => {
    return status ? (
      <i className='tabler-check text-green-500' style={{ fontSize: '1.25rem' }} />
    ) : (
      <i className='tabler-x text-red-500' style={{ fontSize: '1.25rem' }} />
    )
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: () => false
    }
  })

  return (
    <>
      {data.length === 0 ? (
        <CardHeader title='No permissions found' />
      ) : (
        <div className='overflow-x-auto'>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default PermissionsViews
