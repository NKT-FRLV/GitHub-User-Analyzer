import PieComponent from '@/app/components/common/PieComponent'
import { useState } from 'react'
import { Repository } from '@/app/types/github'
import { useRepoStore } from '@/app/store/repos/store'
import { Button, useMediaQuery } from '@mui/material'
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';

interface DiagramProps {
  selectedRepo: Repository
}

const Diagram = ({ selectedRepo}: DiagramProps) => {
    console.log("Diagram rendered")
    const [ open, setOpen ] = useState(false)
    const languages = useRepoStore(state => state.languages)
    const isSmallScreen = useMediaQuery('(max-width: 950px)');
    const pieWidth = isSmallScreen ? 135 : 220;
    const pieHeight = isSmallScreen ? 135 : 220;

  return (
    <>
        <Button
            variant='contained'
            onClick={() => setOpen(prev => !prev)}
            startIcon={<TroubleshootIcon />}
            sx={{ width: 'fit-content', alignSelf: 'flex-start', backgroundColor: 'grey.800' }}
        >
            Diagram
        </Button>
        
        {open && (
            <PieComponent
                title={
                selectedRepo
                    ? `Repo Languages ${selectedRepo.name}:`
                    : "Select a repo to see languages"
                }
                data={languages}
                infoInBytes={true}
                responsiveWidth={pieWidth}
                responsiveHeight={pieHeight}
            />
        )}
    </>
  )
}

export default Diagram