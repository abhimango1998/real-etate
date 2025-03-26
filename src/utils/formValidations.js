import * as yup from 'yup'

export const LoginFormValidationSchema = yup.object({
  email: yup.string().email().required('Please enter your email'),
  password: yup
    .string()
    .trim()
    .required('Please enter your password')
    .min(6, 'Password must be of 6 characters or more')
})

export const ForgotPasswordSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Email is required')
})

export const ResetPasswordSchema = yup.object().shape({
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords & Confirm Password must match')
})

export const UserFormValidationSchema = createMode => {
  return yup.object().shape({
    name: yup.string().trim().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),

    password: yup.string().when([], {
      is: () => createMode,
      then: schema => schema.trim().min(6, 'Password must be of 6 characters or more').required('Password is required'),
      otherwise: schema => schema.notRequired()
    }),

    password_confirmation: yup.string().when('password', {
      is: password => createMode || !!password,
      then: schema =>
        schema
          .required('Confirm password is required')
          .oneOf([yup.ref('password')], 'Passwords & Confirm Password must match'),
      otherwise: schema => schema.notRequired()
    }),

    role_id: yup.string().required('Role is required')
  })
}

export const RolesFormValidationSchema = () => {
  return yup.object().shape({
    name: yup.string().required('Role name is required'),
    permissions: yup.array().min(1, 'At least one permission is required')
  })
}
