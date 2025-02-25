import { useState } from 'react'
import { Box, Typography, IconButton, CircularProgress, Divider } from '@mui/material'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import Button from '@mui/material/Button'


interface AIChatPanelProps {
  fileContent: string
  loading: boolean
  done: boolean
  repoName: string
  setOpenFileDialog: () => void
  handleAskAi: (callback: React.Dispatch<React.SetStateAction<string>>) => void
}

const AIChatPanel = ({ fileContent, loading, done, repoName, setOpenFileDialog, handleAskAi }: AIChatPanelProps) => {

    const [aiMessage, setAiMessage] = useState("Professional review and feedback, by Open AI Model GPT-4o");

  return (
    <>
    <Box display='flex' flexDirection='row' width='100%' justifyContent='flex-end' gap={2}>
            <Button
                variant="contained"
                sx={{ width: '30%', backgroundColor: 'black', fontWeight: 'bold' }}
                disabled={loading || !repoName || done}
                onClick={() => handleAskAi(setAiMessage)}
            >
                { done ? "Select another repo" : loading ? "Asking AI..." : "Ask AI"}
            </Button>
        </Box>
        
        <Box
            sx={{
                position: 'relative',
                my:2,
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
                minHeight: 120,
                backgroundColor: "#f9f9f9",
            }}
        >
            <Box display='flex' justifyContent='flex-end'>
              <IconButton
                sx={{ backgroundColor: 'black', color: 'white', position: 'absolute', top: 5, left: 5 }}
                aria-label="open file content preview"
                component="button"
                onClick={setOpenFileDialog}
                disabled={!fileContent}
              >
                <FileOpenIcon sx={{ fontSize: 30 }} />
              </IconButton>
            </Box>
            <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", fontFamily: "Roboto", fontWeight: 'bold' }}
            >
                {aiMessage || (
                  <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      AI is thinking...
                    </Typography>
                  </Box>
                )}
            </Typography>
        </Box>
    </>
  )
}

export default AIChatPanel