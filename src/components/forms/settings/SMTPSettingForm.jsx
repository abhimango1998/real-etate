'use client'

import { Box, CircularProgress, Grid } from '@mui/material'
import { useFormContext } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'

const SMTPSettingForm = ({ data, loading }) => {
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
            label='From Email'
            placeholder='abc@xyz.com'
            defaultValue={data?.from_address || ''}
            {...register('smtp.from_address')}
            error={!!errors.smtp?.from_address}
            helperText={errors.smtp?.from_address?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label='SMTP Server'
            placeholder='smtp.gmail.com'
            defaultValue={data?.host || ''}
            {...register('smtp.host')}
            error={!!errors.smtp?.host}
            helperText={errors.smtp?.host?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label='SMTP Port'
            placeholder='25, 465, or 587'
            defaultValue={data?.port || ''}
            {...register('smtp.port')}
            error={!!errors.smtp?.port}
            helperText={errors.smtp?.port?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label='SMTP Username'
            placeholder='your-email@gmail.com'
            defaultValue={data?.username || ''}
            {...register('smtp.username')}
            error={!!errors.smtp?.username}
            helperText={errors.smtp?.username?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label='SMTP Password'
            type='password'
            placeholder='••••••••'
            defaultValue={data?.password || ''}
            {...register('smtp.password')}
            error={!!errors.smtp?.password}
            helperText={errors.smtp?.password?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label='SMTP Encryption'
            placeholder='tls'
            defaultValue={data?.encryption || ''}
            {...register('smtp.encryption')}
            error={!!errors.smtp?.encryption}
            helperText={errors.smtp?.encryption?.message}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default SMTPSettingForm
