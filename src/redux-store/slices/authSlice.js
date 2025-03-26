import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  permissions: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('permissions')) : null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, permissions } = action.payload

      state.user = user
      state.token = token
      state.permissions = permissions
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
      localStorage.setItem('permissions', JSON.stringify(permissions))
    },
    logout: state => {
      state.user = null
      state.token = null
      state.permissions = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('permissions')
    }
  }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
