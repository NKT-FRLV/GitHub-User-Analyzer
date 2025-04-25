import { useState } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import CodeIcon from '@mui/icons-material/Code';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Button from '@mui/material/Button'


interface AIChatPanelProps {
  fileContent: string
  loading: boolean
  done: boolean
  repoName: string
  isSmallScreen: boolean
  setOpenFileDialog: () => void
  handleAskAi: (callback: React.Dispatch<React.SetStateAction<string>>) => void
  setOpenCostInfoDialog: () => void
}

const AIChatPanel = ({ fileContent, loading, done, repoName, isSmallScreen, setOpenFileDialog, handleAskAi, setOpenCostInfoDialog }: AIChatPanelProps) => {

    const [aiMessage, setAiMessage] = useState("Professional review and feedback, by Open AI Model GPT-4o");

  return (
    <>
    <Box display='flex' flexDirection='row' width='100%' justifyContent='space-between' gap={2}>
            <Button
              variant="outlined"
              sx={{ width: '30%', border: '1px solid black', color: 'black', fontWeight: 'bold' }}
              aria-label="open file content preview"
              component="button"
              onClick={setOpenFileDialog}
              disabled={!fileContent}
            >
              <CodeIcon sx={{ fontSize: 35 }} />
              { !isSmallScreen && <Typography variant="body2" sx={{fontWeight: 'bold', marginLeft: 1 }}>
                File preview
              </Typography>}
            </Button>
            <Button
                variant="outlined"
                component="button"
                aria-label="open cost info"
                sx={{ width: '30%', border: '1px solid black', color: 'black', fontWeight: 'bold' }}
                onClick={setOpenCostInfoDialog}
                disabled={!fileContent}
            >
                <AttachMoneyIcon sx={{ fontSize: 35 }} />
                { !isSmallScreen && <Typography variant="body2" sx={{fontWeight: 'bold', marginLeft: 1 }}>
                    Cost Info
                </Typography>}
            </Button>
            <Button
                variant="contained"
                sx={{ fontSize: 16, minWidth: '40%', backgroundColor: 'black', fontWeight: 'bold' }}
                disabled={loading || !repoName || done}
                onClick={() => handleAskAi(setAiMessage)}
            >
                { done ? "Select another repo" : loading ? "Asking AI..." : "Ask AI"}
            </Button>
        </Box>
        
        <Box
            sx={{
                my:2,
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
                minHeight: 120,
                backgroundColor: "#f9f9f9",
            }}
        >
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