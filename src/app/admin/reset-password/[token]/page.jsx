'use client'

import { ThemeProvider, createTheme } from '@mui/material/styles'

import ResetPassword from '@/views/ResetPassword'
import { SettingsProvider } from '@core/contexts/settingsContext'

const theme = createTheme()

export default function ResetPasswordPage() {
  return (
    <SettingsProvider>
      <ThemeProvider theme={theme}>
        <ResetPassword mode='light' />
      </ThemeProvider>
    </SettingsProvider>
  )
}
