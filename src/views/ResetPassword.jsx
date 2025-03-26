'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

import { toast } from 'react-toastify'
import classnames from 'classnames'

import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'

import DirectionalIcon from '@components/DirectionalIcon'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

import { useImageVariant } from '@core/hooks/useImageVariant'

import { useSettings } from '@core/hooks/useSettings'

import CustomButton from '@/components/common/CustomButton'
import { ResetPasswordSchema } from '@/utils/formValidations'

const ResetPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 650,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 330,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const ResetPassword = ({ mode }) => {
  const router = useRouter()

  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [loading, setLoading] = useState(false)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-reset-password-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-reset-password-light.png'

  // Hooks
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const characterIllustration = useImageVariant(mode, lightIllustration, darkIllustration)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolverlver: yupResolver(ResetPasswordSchema)
  })

  const onSubmit = async data => {
    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          password: data.password,
          password_confirmation: data.confirmPassword
        })
      })

      const responseData = await response.json()

      if (!response.ok) {
        toast.error(responseData.message || 'Password reset failed')
        throw new Error(responseData.message || 'Password reset failed')
      }

      toast.success('Password reset successful!')
      router.push('/login')
    } catch (error) {
      toast.error(error.message || 'An error occurred')
      console.error('Detailed error:', {
        message: error.message,
        stack: error.stack
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <ResetPasswordIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && (
          <MaskImg
            alt='mask'
            src={authBackground}
            className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
          />
        )}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link href={'/'} className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Reset Password 🔒</Typography>
            <Typography>Your new password must be different from previously used passwords</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <CustomTextField
              autoFocus
              fullWidth
              label='New Password'
              placeholder='············'
              type={isPasswordShown ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <CustomTextField
              fullWidth
              label='Confirm Password'
              placeholder='············'
              type={isConfirmPasswordShown ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <CustomButton fullWidth={true} variant={'contained'} type='submit' loading={loading} disabled={loading}>
              Set New Password
            </CustomButton>
            <Typography className='flex justify-center items-center' color='primary'>
              <Link href={'/login'} className='flex items-center gap-1.5'>
                <DirectionalIcon
                  ltrIconClass='tabler-chevron-left'
                  rtlIconClass='tabler-chevron-right'
                  className='text-xl'
                />
                <span>Back to login</span>
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
