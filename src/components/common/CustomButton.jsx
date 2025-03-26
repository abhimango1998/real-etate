import { Button, CircularProgress } from '@mui/material'

const CustomButton = ({
  variant = 'contained',
  color = 'primary',
  fullWidth = false,
  type = 'button',
  size = 'medium',
  onClick = () => {},
  loading = false,
  disabled = false,
  children = '',
  width = '100%',
  endIcon = null,
  sx = {}
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      type={type}
      size={size}
      onClick={onClick}
      disabled={disabled}
      endIcon={!loading && !disabled && endIcon}
      sx={{
        width: width,
        ...sx
      }}
    >
      {loading ? <CircularProgress size={24} color='warning' /> : children}
    </Button>
  )
}

export default CustomButton
