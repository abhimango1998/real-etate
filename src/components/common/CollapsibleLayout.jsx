'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Accordion from '@mui/material/Accordion'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

const CollapsibleLayout = ({ title, component }) => {
  const [expanded, setExpanded] = useState('panel1')

  const handleExpandChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <Accordion expanded={expanded === 'panel1'} onChange={handleExpandChange('panel1')}>
      <AccordionSummary expandIcon={<i className='tabler-chevron-right' />}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <Divider />
      <AccordionDetails className='!pbs-6'>{component}</AccordionDetails>
    </Accordion>
  )
}

export default CollapsibleLayout
