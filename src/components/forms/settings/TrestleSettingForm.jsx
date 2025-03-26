'use client'

import { Box, CircularProgress, Grid } from '@mui/material'

import { useFormContext } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'

const TrestleSettingForm = ({ data, loading }) => {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={24} color='warning' />
      </Box>
    )
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label='Client ID'
            placeholder='client-id-111'
            defaultValue={data?.client_id || ''}
            {...register('trestle.client_id')}
            error={!!errors.trestle?.client_id}
            helperText={errors.trestle?.client_id?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label='Client Secret'
            placeholder='very-secret'
            type='password'
            defaultValue={data?.client_secret || ''}
            {...register('trestle.client_secret')}
            error={!!errors.trestle?.client_secret}
            helperText={errors.trestle?.client_secret?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label='API URL'
            placeholder='https://api.example.com'
            defaultValue={data?.api_url || ''}
            {...register('trestle.api_url')}
            error={!!errors.trestle?.api_url}
            helperText={errors.trestle?.api_url?.message}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default TrestleSettingForm
