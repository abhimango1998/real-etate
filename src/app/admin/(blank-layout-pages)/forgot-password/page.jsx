// Component Imports

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import ForgotPassword from '@/views/ForgotPassword'

export const metadata = {
  title: 'Forgot Password',
  description: 'Forgot Password Page'
}

const ForgotPasswordPage = () => {
  // Vars
  const mode = getServerMode()

  return <ForgotPassword mode={mode} />
}

export default ForgotPasswordPage
