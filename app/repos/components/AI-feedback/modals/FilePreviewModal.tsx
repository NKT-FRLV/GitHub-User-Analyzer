import { useMemo, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, Box, Typography, Button, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { coy, dracula, tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import CloseIcon from '@mui/icons-material/Close'
import { mapFileTypeToSyntaxHighlighter } from '@/app/utils'

type Theme = typeof coy | typeof dracula | typeof tomorrow;

interface FilePreviewModalProps {
  isOpen: boolean
  setClose: () => void
  fileType: string
  fileContent: string
}

const FilePreviewModal = ({ isOpen, setClose, fileType, fileContent }: FilePreviewModalProps) => {

    const [fileTheme, setFileTheme] = useState<Theme>(dracula);
    const stableFileType = useMemo(() => mapFileTypeToSyntaxHighlighter(fileType), [fileType]);
    
    const handleThemeChange = (
        event: React.MouseEvent<HTMLElement>,
        newTheme: Theme,
      ) => {
        if (newTheme) {
          setFileTheme(newTheme);
        }
      };

  return (
    <Dialog
          open={isOpen}
          onClose={setClose}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
              <Typography sx={{ fontWeight: "bold" }}>
                Analyzed file content ( .{fileType} )
              </Typography>
              <Button
                autoFocus
                aria-label="close"
                variant="contained"
                size="small"
                sx={{ backgroundColor: "grey.900", color: "grey.200" }}
                onClick={setClose}
              >
                <CloseIcon sx={{ color: "grey.200" }} />
              </Button>
            </Box>
            <Box display='flex' flexDirection='row' alignItems='center' gap={2}>
              <Typography sx={{ fontWeight: "bold" }}>
                Theme: 
              </Typography>
              <Box display='flex' flexDirection='row' gap={2}>
                <ToggleButtonGroup
                  size="small"
                  color="secondary"
                  value={fileTheme}
                  exclusive
                  onChange={handleThemeChange}
                  aria-label="Theme toggler"
                >
                  <ToggleButton value={coy}>Light</ToggleButton>
                  <ToggleButton value={dracula}>Dracula</ToggleButton>
                  <ToggleButton value={tomorrow}>Tomorrow</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ maxHeight: "80vh", overflow: "auto" }}>
          <SyntaxHighlighter
            language={stableFileType}
            style={fileTheme}
            showLineNumbers
            wrapLongLines
          >
            {fileContent}
          </SyntaxHighlighter>
          </DialogContent>
        </Dialog>
  )
}

export default FilePreviewModal