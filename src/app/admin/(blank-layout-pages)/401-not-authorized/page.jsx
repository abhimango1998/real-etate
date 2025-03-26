// Component Imports

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import NotAuthorized from '@/views/NotAuthorized'

export const metadata = {
  title: 'Not Authorized',
  description: 'You are not authorized to access this page.'
}

const NotAuthorizedPage = () => {
  // Vars
  const mode = getServerMode()

  return <NotAuthorized mode={mode} />
}

export default NotAuthorizedPage
