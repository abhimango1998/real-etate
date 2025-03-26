import { useState, useEffect } from 'react'

import { Grid, Typography, Checkbox, FormControlLabel, Box, Divider } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import CustomTextField from '@/@core/components/mui/TextField'

import { RolesFormValidationSchema } from '@/utils/formValidations'
import CustomButton from '@/components/common/CustomButton'

const RolesForm = ({ permissions, role, onClose }) => {
  const token = useSelector(state => state.auth.token)
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: role?.name || '',
      permissions: role?.permissions || []
    },
    resolver: yupResolver(RolesFormValidationSchema())
  })

  useEffect(() => {
    if (role && role.permissions) {
      setSelectedPermissions(role.permissions.map(p => p.id))
    }
  }, [role])

  const handlePermissionChange = (permissionId, checked) => {
    setSelectedPermissions(prev => {
      if (checked) {
        return [...prev, permissionId]
      } else {
        return prev.filter(id => id !== permissionId)
      }
    })
  }

  useEffect(() => {
    setValue('permissions', selectedPermissions)
  }, [selectedPermissions, setValue])

  const isAllPermissionsSelected = permissionGroup => {
    if (!permissionGroup) return false

    const allPermissionIds = Object.values(permissionGroup)
      .flat()
      .map(permission => permission.id)

    return allPermissionIds.every(id => selectedPermissions.includes(id))
  }

  const handleSelectAllPermissions = (permissionGroup, checked) => {
    if (!permissionGroup) return

    const allPermissionIds = Object.values(permissionGroup)
      .flat()
      .map(permission => permission.id)

    if (checked) {
      setSelectedPermissions(prev => [...new Set([...prev, ...allPermissionIds])])
    } else {
      setSelectedPermissions(prev => prev.filter(id => !allPermissionIds.includes(id)))
    }
  }

  const handleFormSubmit = async data => {
    setSubmitLoading(true)

    try {
      const url = role ? `/api/admin/roles/${role.id}` : '/api/admin/roles'
      const method = role ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const result = await response.json()

        toast.error(result.message || 'Error processing role')

        return
      }

      reset()
      onClose()
      toast.success(role ? 'Role updated successfully' : 'Role created successfully')
    } catch (error) {
      console.error('Error submitting permission form', error)
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Role Name'
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant='h6'>Permissions</Typography>

          {permissions &&
            Object.entries(permissions).map(([category, permissionTypes], index, array) => (
              <Box key={category}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isAllPermissionsSelected(permissionTypes)}
                        onChange={e => handleSelectAllPermissions(permissionTypes, e.target.checked)}
                      />
                    }
                    label={
                      <Typography variant='subtitle1' sx={{ textTransform: 'capitalize' }}>
                        {category}
                      </Typography>
                    }
                  />
                </Box>

                <Grid container>
                  {Object.entries(permissionTypes).map(([type, permissionList]) => (
                    <Grid item xs={12} sm={6} md={3} key={`${category}-${type}`}>
                      <Box sx={{ pl: 8 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={permissionList.every(p => selectedPermissions.includes(p.id))}
                              onChange={e => {
                                permissionList.forEach(p => {
                                  handlePermissionChange(p.id, e.target.checked)
                                })
                              }}
                            />
                          }
                          label={<Typography sx={{ textTransform: 'capitalize' }}>{type}</Typography>}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                {index < array.length - 1 && <Divider sx={{ mb: 2 }} />}
              </Box>
            ))}
          {errors && errors?.permissions && <Typography color='error'>{errors.permissions.message}</Typography>}
        </Grid>

        <Grid item xs={12}>
          <Box>
            <CustomButton type={'submit'} variant='contained' disabled={submitLoading} loading={submitLoading}>
              {role ? 'Update' : 'Create'} Role
            </CustomButton>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}

export default RolesForm
