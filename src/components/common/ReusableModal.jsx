import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Typography } from '@mui/material'

import CustomButton from '@/components/common/CustomButton'
import DialogCloseButton from '@/components/common/DialogCloseButton'

const ReasuableModal = ({
  open,
  onClose,
  title,
  onConfirmDelete,
  loading,
  disabled,
  showDeleteButton = false,
  children
}) => {
  return (
    <>
      <Dialog
        fullWidth
        onClose={onClose}
        aria-labelledby='customized-dialog-title'
        open={open}
        closeAfterTransition={false}
        PaperProps={{ sx: { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            {title}
          </Typography>
          <DialogCloseButton onClick={onClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>{children}</DialogContent>
        {showDeleteButton && (
          <DialogActions className='dialog-actions-dense'>
            <CustomButton
              width='25%'
              loading={loading}
              disabled={disabled}
              onClick={onConfirmDelete}
              variant={'contained'}
              color={'error'}
            >
              Delete
            </CustomButton>
          </DialogActions>
        )}
      </Dialog>
    </>
  )
}

export default ReasuableModal
