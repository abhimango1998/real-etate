import { Grid, Typography } from '@mui/material'

import CustomButton from './CustomButton'

const DashboardPageHeader = ({ isShowButton, title, btnText, handleClick }) => {
  return (
    <Grid item xs={12} display={'flex'} justifyContent={'space-between'}>
      <Typography variant='h4'>{title}</Typography>
      {isShowButton && (
        <CustomButton width='200px' variant={'contained'} onClick={() => handleClick()}>
          {btnText}
        </CustomButton>
      )}
    </Grid>
  )
}

export default DashboardPageHeader
